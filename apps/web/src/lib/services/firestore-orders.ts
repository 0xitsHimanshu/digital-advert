import type { DocumentData } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import type { PaymentOrder, PaymentOrderStatus } from "@/lib/types/admin";

const ORDERS_SUBCOLLECTION = "orders";

function parseOrder(customerId: string, orderId: string, data: DocumentData): PaymentOrder | null {
  if (!data || typeof data.razorpayOrderId !== "string") return null;
  return {
    id: orderId,
    customerId: typeof data.customerId === "string" ? data.customerId : customerId,
    razorpayOrderId: data.razorpayOrderId,
    amountCents: typeof data.amountCents === "number" ? data.amountCents : 0,
    currency: typeof data.currency === "string" ? data.currency : "INR",
    status: (data.status as PaymentOrderStatus) ?? "PAYMENT_PENDING",
    lines: Array.isArray(data.lines) ? data.lines : [],
    subtotalCents: typeof data.subtotalCents === "number" ? data.subtotalCents : 0,
    discountCents: typeof data.discountCents === "number" ? data.discountCents : 0,
    taxCents: typeof data.taxCents === "number" ? data.taxCents : 0,
    createdAt:
      typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    paidAt: typeof data.paidAt === "string" ? data.paidAt : undefined,
    razorpayPaymentId:
      typeof data.razorpayPaymentId === "string" ? data.razorpayPaymentId : undefined,
    paymentMethod: typeof data.paymentMethod === "string" ? data.paymentMethod : undefined,
    updates: Array.isArray(data.updates) ? data.updates : undefined,
    couponCode: typeof data.couponCode === "string" ? data.couponCode : undefined,
  };
}

export type OrderListFilters = {
  status?: PaymentOrderStatus;
  search?: string;
  sort?: "newest" | "oldest" | "amount_desc" | "amount_asc";
};

export async function listAllOrders(filters: OrderListFilters = {}): Promise<PaymentOrder[]> {
  const snap = await getAdminFirestore().collectionGroup(ORDERS_SUBCOLLECTION).get();

  let orders = snap.docs
    .map((doc) => {
      const customerId = doc.ref.parent.parent?.id ?? "";
      return parseOrder(customerId, doc.id, doc.data());
    })
    .filter((o): o is PaymentOrder => o !== null);

  if (filters.status) {
    orders = orders.filter((o) => o.status === filters.status);
  }

  const q = filters.search?.trim().toLowerCase();
  if (q) {
    orders = orders.filter((o) => {
      const haystack = [
        o.id,
        o.customerId,
        o.razorpayOrderId,
        o.razorpayPaymentId,
        ...o.lines.map((l) => l.title),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  const sort = filters.sort ?? "newest";
  orders.sort((a, b) => {
    const aTime = new Date(a.paidAt ?? a.createdAt).getTime();
    const bTime = new Date(b.paidAt ?? b.createdAt).getTime();
    if (sort === "oldest") return aTime - bTime;
    if (sort === "amount_desc") return b.amountCents - a.amountCents;
    if (sort === "amount_asc") return a.amountCents - b.amountCents;
    return bTime - aTime;
  });

  return orders;
}
