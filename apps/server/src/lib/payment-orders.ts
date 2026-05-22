import type { PricedCartLine } from "./cart-pricing.js";

export type PaymentOrderStatus =
  | "CREATED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "PAYMENT_FAILED";

export type PaymentOrder = {
  id: string;
  customerId: string;
  razorpayOrderId: string;
  amountCents: number;
  currency: string;
  status: PaymentOrderStatus;
  lines: PricedCartLine[];
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  createdAt: string;
  paidAt?: string;
  razorpayPaymentId?: string;
};

const orders = new Map<string, PaymentOrder>();

export function createPaymentOrder(
  order: Omit<PaymentOrder, "createdAt">,
): PaymentOrder {
  const record: PaymentOrder = {
    ...order,
    createdAt: new Date().toISOString(),
  };
  orders.set(record.id, record);
  return record;
}

export function getPaymentOrder(id: string): PaymentOrder | undefined {
  return orders.get(id);
}

export function getPaymentOrderByRazorpayId(
  razorpayOrderId: string,
): PaymentOrder | undefined {
  for (const order of orders.values()) {
    if (order.razorpayOrderId === razorpayOrderId) return order;
  }
  return undefined;
}

export function updatePaymentOrder(
  id: string,
  patch: Partial<PaymentOrder>,
): PaymentOrder | undefined {
  const existing = orders.get(id);
  if (!existing) return undefined;
  const next = { ...existing, ...patch };
  orders.set(id, next);
  return next;
}
