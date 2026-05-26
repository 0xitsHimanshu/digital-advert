import type { DocumentData } from "firebase-admin/firestore";

import { getFirestoreDb } from "./firestore-db.js";

export type FirestoreCoupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minSubtotalCents?: number;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
  expiresAt?: string;
};

const COLLECTION = "coupons";

function parseCoupon(id: string, data: DocumentData): FirestoreCoupon | null {
  if (!data || typeof data.code !== "string") return null;
  return {
    id,
    code: data.code,
    type: data.type === "fixed" ? "fixed" : "percentage",
    value: typeof data.value === "number" ? data.value : 0,
    minSubtotalCents:
      typeof data.minSubtotalCents === "number" ? data.minSubtotalCents : undefined,
    usageLimit: typeof data.usageLimit === "number" ? data.usageLimit : undefined,
    usageCount: typeof data.usageCount === "number" ? data.usageCount : 0,
    active: data.active !== false,
    expiresAt: typeof data.expiresAt === "string" ? data.expiresAt : undefined,
  };
}

export async function getCouponByCode(code: string): Promise<FirestoreCoupon | null> {
  const db = getFirestoreDb();
  if (!db) return null;
  const id = code.trim().toUpperCase();
  const snap = await db.collection(COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  return parseCoupon(snap.id, snap.data() ?? {});
}

export function computeCouponDiscountCents(
  coupon: FirestoreCoupon,
  subtotalCents: number,
): number {
  if (!coupon.active) return 0;
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return 0;
  if (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) return 0;
  if (coupon.minSubtotalCents != null && subtotalCents < coupon.minSubtotalCents) return 0;

  let discount =
    coupon.type === "percentage"
      ? Math.round(subtotalCents * (coupon.value / 100))
      : coupon.value;
  return Math.min(discount, subtotalCents);
}

export async function recordCouponRedemption(
  code: string,
  customerId: string,
): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  const id = code.trim().toUpperCase();
  const ref = db.collection(COLLECTION).doc(id);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return;
    const data = snap.data() ?? {};
    const redeemedBy = Array.isArray(data.redeemedBy)
      ? (data.redeemedBy as string[])
      : [];
    if (redeemedBy.includes(customerId)) return;
    tx.set(
      ref,
      {
        usageCount: (typeof data.usageCount === "number" ? data.usageCount : 0) + 1,
        redeemedBy: [...redeemedBy, customerId],
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  });
}
