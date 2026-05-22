import { randomUUID } from "node:crypto";

import { Router, type IRouter } from "express";

import { priceCart, type CartLineInput } from "../lib/cart-pricing.js";
import {
  createPaymentOrder,
  getPaymentOrder,
  getPaymentOrderByRazorpayId,
  updatePaymentOrder,
} from "../lib/payment-orders.js";
import {
  createRazorpayClient,
  getRazorpayConfig,
  verifyRazorpayPaymentSignature,
} from "../lib/razorpay.js";
import { requireCustomerJwt } from "../middleware/require-customer-jwt.js";

export const paymentsRouter: IRouter = Router();

paymentsRouter.use(requireCustomerJwt);

function parseCartItems(body: unknown): CartLineInput[] | null {
  if (!Array.isArray(body)) return null;
  const items: CartLineInput[] = [];
  for (const raw of body) {
    if (
      typeof raw !== "object" ||
      raw === null ||
      typeof (raw as CartLineInput).serviceId !== "string" ||
      typeof (raw as CartLineInput).quantity !== "number"
    ) {
      return null;
    }
    items.push({
      serviceId: (raw as CartLineInput).serviceId,
      quantity: (raw as CartLineInput).quantity,
    });
  }
  return items.length ? items : null;
}

paymentsRouter.post("/create-order", async (req, res, next) => {
  try {
    const config = getRazorpayConfig();
    const razorpay = createRazorpayClient();
    if (!config || !razorpay) {
      res.status(503).json({
        error: "razorpay_not_configured",
        message:
          "Payment gateway is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the server.",
      });
      return;
    }

    const items = parseCartItems(req.body?.items);
    if (!items) {
      res.status(400).json({
        error: "validation_error",
        message: "items must be a non-empty array of { serviceId, quantity }.",
      });
      return;
    }

    const couponCode =
      typeof req.body?.couponCode === "string" ? req.body.couponCode : undefined;
    const adDiscountUnlocked = req.body?.adDiscountUnlocked === true;

    const priced = priceCart(items, { couponCode, adDiscountUnlocked });
    if ("error" in priced) {
      res.status(400).json({ error: "validation_error", message: priced.error });
      return;
    }

    if (priced.totalCents < 1) {
      res.status(400).json({
        error: "validation_error",
        message: "Order total must be greater than zero.",
      });
      return;
    }

    const orderId = randomUUID();
    const receipt = orderId.replace(/-/g, "").slice(0, 40);

    const razorpayOrder = await razorpay.orders.create({
      amount: priced.totalCents,
      currency: priced.currency,
      receipt,
      notes: {
        internal_order_id: orderId,
        customer_id: req.customer!.sub,
      },
    });

    createPaymentOrder({
      id: orderId,
      customerId: req.customer!.sub,
      razorpayOrderId: razorpayOrder.id,
      amountCents: priced.totalCents,
      currency: priced.currency,
      status: "PAYMENT_PENDING",
      lines: priced.lines,
      subtotalCents: priced.subtotalCents,
      discountCents: priced.discountCents,
      taxCents: priced.taxCents,
    });

    res.json({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: priced.totalCents,
      currency: priced.currency,
      keyId: config.keyId,
    });
  } catch (e) {
    next(e);
  }
});

paymentsRouter.post("/verify", async (req, res, next) => {
  try {
    const config = getRazorpayConfig();
    if (!config) {
      res.status(503).json({
        error: "razorpay_not_configured",
        message: "Payment gateway is not configured.",
      });
      return;
    }

    const razorpayOrderId =
      typeof req.body?.razorpay_order_id === "string"
        ? req.body.razorpay_order_id
        : typeof req.body?.razorpayOrderId === "string"
          ? req.body.razorpayOrderId
          : "";
    const razorpayPaymentId =
      typeof req.body?.razorpay_payment_id === "string"
        ? req.body.razorpay_payment_id
        : typeof req.body?.razorpayPaymentId === "string"
          ? req.body.razorpayPaymentId
          : "";
    const razorpaySignature =
      typeof req.body?.razorpay_signature === "string"
        ? req.body.razorpay_signature
        : typeof req.body?.razorpaySignature === "string"
          ? req.body.razorpaySignature
          : "";

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      res.status(400).json({
        error: "validation_error",
        message:
          "razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.",
      });
      return;
    }

    const order =
      getPaymentOrderByRazorpayId(razorpayOrderId) ??
      (typeof req.body?.orderId === "string"
        ? getPaymentOrder(req.body.orderId)
        : undefined);

    if (!order || order.customerId !== req.customer!.sub) {
      res.status(404).json({
        error: "order_not_found",
        message: "Order not found.",
      });
      return;
    }

    const valid = verifyRazorpayPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      config.keySecret,
    );

    if (!valid) {
      updatePaymentOrder(order.id, { status: "PAYMENT_FAILED" });
      res.status(400).json({
        error: "invalid_signature",
        message: "Payment verification failed.",
      });
      return;
    }

    const paid = updatePaymentOrder(order.id, {
      status: "PAID",
      paidAt: new Date().toISOString(),
      razorpayPaymentId,
    });

    res.json({
      success: true,
      order: paid,
    });
  } catch (e) {
    next(e);
  }
});
