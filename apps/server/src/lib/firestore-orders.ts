import type { DocumentData } from "firebase-admin/firestore";
import type { Firestore } from "firebase-admin/firestore";

import type { PricedCartLine } from "./cart-pricing.js";
import { getFirestoreDb, requireFirestoreDb } from "./firestore-db.js";
import { stripUndefined } from "./firestore-sanitize.js";

export type PaymentOrderStatus =
  | "CREATED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "PAYMENT_FAILED";

export type OrderUpdate = {
  id: string;
  title: string;
  label: string;
  value: string;
  createdAt: string;
};

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
  paymentMethod?: string;
  updates?: OrderUpdate[];
  couponCode?: string;
};

function parseOrderUpdates(raw: unknown): OrderUpdate[] {
  if (!Array.isArray(raw)) return [];
  const updates: OrderUpdate[] = [];
  for (const item of raw) {
    if (
      typeof item === "object" &&
      item !== null &&
      typeof (item as OrderUpdate).title === "string" &&
      typeof (item as OrderUpdate).label === "string" &&
      typeof (item as OrderUpdate).value === "string"
    ) {
      updates.push({
        id: typeof (item as OrderUpdate).id === "string" ? (item as OrderUpdate).id : "",
        title: (item as OrderUpdate).title,
        label: (item as OrderUpdate).label,
        value: (item as OrderUpdate).value,
        createdAt:
          typeof (item as OrderUpdate).createdAt === "string"
            ? (item as OrderUpdate).createdAt
            : new Date().toISOString(),
      });
    }
  }
  return updates;
}

const ORDERS_SUBCOLLECTION = "orders";

function customerOrdersRef(db: Firestore, customerId: string) {
  return db.collection("customers").doc(customerId).collection(ORDERS_SUBCOLLECTION);
}

function parseOrderDoc(
  customerId: string,
  orderId: string,
  data: DocumentData | undefined,
): PaymentOrder | null {
  if (!data || typeof data.razorpayOrderId !== "string") return null;

  const lines = Array.isArray(data.lines) ? (data.lines as PricedCartLine[]) : [];

  return {
    id: orderId,
    customerId: typeof data.customerId === "string" ? data.customerId : customerId,
    razorpayOrderId: data.razorpayOrderId,
    amountCents: typeof data.amountCents === "number" ? data.amountCents : 0,
    currency: typeof data.currency === "string" ? data.currency : "INR",
    status: (data.status as PaymentOrderStatus) ?? "PAYMENT_PENDING",
    lines,
    subtotalCents: typeof data.subtotalCents === "number" ? data.subtotalCents : 0,
    discountCents: typeof data.discountCents === "number" ? data.discountCents : 0,
    taxCents: typeof data.taxCents === "number" ? data.taxCents : 0,
    createdAt:
      typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    paidAt: typeof data.paidAt === "string" ? data.paidAt : undefined,
    razorpayPaymentId:
      typeof data.razorpayPaymentId === "string" ? data.razorpayPaymentId : undefined,
    paymentMethod:
      typeof data.paymentMethod === "string" ? data.paymentMethod : undefined,
    updates: parseOrderUpdates(data.updates),
    couponCode: typeof data.couponCode === "string" ? data.couponCode : undefined,
  };
}

export async function createPaymentOrder(
  order: Omit<PaymentOrder, "createdAt">,
): Promise<PaymentOrder> {
  const db = requireFirestoreDb();
  const record: PaymentOrder = {
    ...order,
    customerId: order.customerId,
    createdAt: new Date().toISOString(),
  };

  await customerOrdersRef(db, order.customerId)
    .doc(order.id)
    .set(record);

  return record;
}

export async function getPaymentOrderForCustomer(
  customerId: string,
  orderId: string,
): Promise<PaymentOrder | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  const snap = await customerOrdersRef(db, customerId).doc(orderId).get();
  if (!snap.exists) return null;
  return parseOrderDoc(customerId, snap.id, snap.data());
}

export async function getPaymentOrderByRazorpayId(
  razorpayOrderId: string,
): Promise<PaymentOrder | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  const snap = await db
    .collectionGroup(ORDERS_SUBCOLLECTION)
    .where("razorpayOrderId", "==", razorpayOrderId)
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  const customerId = doc.ref.parent.parent?.id ?? "";
  return parseOrderDoc(customerId, doc.id, doc.data());
}

export async function getPaymentOrderById(orderId: string): Promise<PaymentOrder | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  const snap = await db
    .collectionGroup(ORDERS_SUBCOLLECTION)
    .where("id", "==", orderId)
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  const customerId = doc.ref.parent.parent?.id ?? "";
  return parseOrderDoc(customerId, doc.id, doc.data());
}

export async function updatePaymentOrder(
  customerId: string,
  orderId: string,
  patch: Partial<PaymentOrder>,
): Promise<PaymentOrder | null> {
  const db = requireFirestoreDb();
  const ref = customerOrdersRef(db, customerId).doc(orderId);
  const existing = await ref.get();
  if (!existing.exists) return null;

  const current = parseOrderDoc(customerId, existing.id, existing.data());
  if (!current) return null;

  const next: PaymentOrder = { ...current, ...patch, id: orderId, customerId };
  await ref.set(
    stripUndefined(next as unknown as Record<string, unknown>),
    { merge: true },
  );
  return next;
}

/** Completed orders for one customer (Firebase uid), newest first. */
export async function listPaidOrdersByCustomer(
  customerId: string,
): Promise<PaymentOrder[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  // Filter by status only (no composite index). Sort by paidAt in memory.
  const snap = await customerOrdersRef(db, customerId)
    .where("status", "==", "PAID")
    .get();

  return snap.docs
    .map((doc) => parseOrderDoc(customerId, doc.id, doc.data()))
    .filter((o): o is PaymentOrder => o !== null)
    .sort(
      (a, b) =>
        new Date(b.paidAt ?? b.createdAt).getTime() -
        new Date(a.paidAt ?? a.createdAt).getTime(),
    );
}
