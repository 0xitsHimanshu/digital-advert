import { randomUUID } from "node:crypto";

import { Router, type IRouter } from "express";

import { priceCart, type CartLineInput } from "../lib/cart-pricing.js";
import { getCustomerProfile } from "../lib/customer-profiles.js";
import { recordCouponRedemption } from "../lib/firestore-coupons.js";
import { buildDefaultOrderUpdates } from "../lib/order-updates.js";
import {
  createPaymentOrder,
  getPaymentOrderById,
  getPaymentOrderByRazorpayId,
  getPaymentOrderForCustomer,
  listPaidOrdersByCustomer,
  updatePaymentOrder,
} from "../lib/payment-orders.js";
import {
  createRazorpayClient,
  getRazorpayConfig,
  verifyRazorpayPaymentSignature,
} from "../lib/razorpay.js";
import { fetchRazorpayPaymentMethodLabel } from "../lib/razorpay-payment-method.js";
import { requireCustomerJwt } from "../middleware/require-customer-jwt.js";

export const paymentsRouter: IRouter = Router();

paymentsRouter.use(requireCustomerJwt);

paymentsRouter.get("/orders", async (req, res, next) => {
  try {
    const customerId = req.customer!.sub;
    const orders = await listPaidOrdersByCustomer(customerId);
    res.json({ count: orders.length, orders });
  } catch (e) {
    next(e);
  }
});

paymentsRouter.get("/orders/:orderId", async (req, res, next) => {
  try {
    const customerId = req.customer!.sub;
    const orderId =
      typeof req.params.orderId === "string" ? req.params.orderId : "";

    const order = await getPaymentOrderForCustomer(customerId, orderId);
    if (!order || order.customerId !== customerId) {
      res.status(404).json({
        error: "order_not_found",
        message: "Order not found.",
      });
      return;
    }

    let updates = order.updates;
    if (!updates?.length) {
      const profile = await getCustomerProfile(customerId);
      updates = buildDefaultOrderUpdates(profile?.phoneNumber);
      if (order.status === "PAID") {
        await updatePaymentOrder(customerId, orderId, { updates });
      }
    }

    let paymentMethod = order.paymentMethod;
    const razorpay = createRazorpayClient();
    if (razorpay && order.razorpayPaymentId) {
      try {
        const resolved = await fetchRazorpayPaymentMethodLabel(
          razorpay,
          order.razorpayPaymentId,
        );
        paymentMethod = resolved;
        if (
          order.status === "PAID" &&
          typeof resolved === "string" &&
          resolved &&
          resolved !== order.paymentMethod
        ) {
          await updatePaymentOrder(customerId, orderId, { paymentMethod: resolved });
        }
      } catch {
        // Keep stored label when Razorpay is unreachable.
      }
    }

    res.json({
      order: {
        ...order,
        paymentMethod,
        updates,
      },
    });
  } catch (e) {
    next(e);
  }
});

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

    const priced = await priceCart(items, { couponCode, adDiscountUnlocked });
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

    const customerId = req.customer!.sub;
    const orderId = randomUUID();
    const receipt = orderId.replace(/-/g, "").slice(0, 40);

    const razorpayOrder = await razorpay.orders.create({
      amount: priced.totalCents,
      currency: priced.currency,
      receipt,
      notes: {
        internal_order_id: orderId,
        customer_id: customerId,
      },
    });

    await createPaymentOrder({
      id: orderId,
      customerId,
      razorpayOrderId: razorpayOrder.id,
      amountCents: priced.totalCents,
      currency: priced.currency,
      status: "PAYMENT_PENDING",
      lines: priced.lines,
      subtotalCents: priced.subtotalCents,
      discountCents: priced.discountCents,
      taxCents: priced.taxCents,
      ...(couponCode ? { couponCode: couponCode.trim().toUpperCase() } : {}),
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

    const customerId = req.customer!.sub;
    const order =
      (await getPaymentOrderByRazorpayId(razorpayOrderId)) ??
      (typeof req.body?.orderId === "string"
        ? await getPaymentOrderById(req.body.orderId)
        : null);

    if (!order || order.customerId !== customerId) {
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
      await updatePaymentOrder(customerId, order.id, { status: "PAYMENT_FAILED" });
      res.status(400).json({
        error: "invalid_signature",
        message: "Payment verification failed.",
      });
      return;
    }

    const profile = await getCustomerProfile(customerId);

    let paymentMethod = "Online Payment";
    const razorpayClient = createRazorpayClient();
    if (razorpayClient) {
      try {
        paymentMethod = await fetchRazorpayPaymentMethodLabel(
          razorpayClient,
          razorpayPaymentId,
        );
      } catch {
        // Fall back when payment fetch fails after signature verification.
      }
    }

    const paid = await updatePaymentOrder(customerId, order.id, {
      status: "PAID",
      paidAt: new Date().toISOString(),
      razorpayPaymentId,
      paymentMethod,
      updates: buildDefaultOrderUpdates(profile?.phoneNumber),
    });

    if (order.couponCode) {
      await recordCouponRedemption(order.couponCode, customerId);
    }

    res.json({
      success: true,
      order: paid,
    });
  } catch (e) {
    next(e);
  }
});
