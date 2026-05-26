import type { DocumentData } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import type { Coupon, CouponType } from "@/lib/types/admin";

const COLLECTION = "coupons";

function parseCoupon(id: string, data: DocumentData): Coupon | null {
  if (!data || typeof data.code !== "string") return null;
  const type: CouponType = data.type === "fixed" ? "fixed" : "percentage";
  return {
    id,
    code: data.code,
    type,
    value: typeof data.value === "number" ? data.value : 0,
    minSubtotalCents:
      typeof data.minSubtotalCents === "number" ? data.minSubtotalCents : undefined,
    expiresAt: typeof data.expiresAt === "string" ? data.expiresAt : undefined,
    usageLimit: typeof data.usageLimit === "number" ? data.usageLimit : undefined,
    usageCount: typeof data.usageCount === "number" ? data.usageCount : 0,
    redeemedBy: Array.isArray(data.redeemedBy)
      ? (data.redeemedBy as string[]).filter((x) => typeof x === "string")
      : [],
    active: data.active !== false,
    createdAt:
      typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    updatedAt:
      typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
  };
}

export async function listCoupons(): Promise<Coupon[]> {
  const snap = await getAdminFirestore().collection(COLLECTION).get();
  return snap.docs
    .map((doc) => parseCoupon(doc.id, doc.data()))
    .filter((c): c is Coupon => c !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const normalized = code.trim().toUpperCase();
  const snap = await getAdminFirestore().collection(COLLECTION).doc(normalized).get();
  if (!snap.exists) return null;
  return parseCoupon(snap.id, snap.data() ?? {});
}

export async function upsertCoupon(coupon: Omit<Coupon, "createdAt" | "updatedAt"> & {
  createdAt?: string;
}): Promise<Coupon> {
  const now = new Date().toISOString();
  const id = coupon.code.trim().toUpperCase();
  const ref = getAdminFirestore().collection(COLLECTION).doc(id);
  const existing = await ref.get();
  const record: Coupon = {
    ...coupon,
    id,
    code: id,
    createdAt:
      existing.exists && typeof existing.data()?.createdAt === "string"
        ? existing.data()!.createdAt
        : (coupon.createdAt ?? now),
    updatedAt: now,
  };
  await ref.set(record);
  return record;
}

export async function deleteCoupon(id: string): Promise<void> {
  await getAdminFirestore().collection(COLLECTION).doc(id.toUpperCase()).delete();
}

/** Validate coupon for checkout — mirrors server cart-pricing logic */
export function validateCouponForCart(
  coupon: Coupon,
  subtotalCents: number,
  customerId?: string,
): { valid: boolean; discountCents: number; reason?: string } {
  if (!coupon.active) {
    return { valid: false, discountCents: 0, reason: "Coupon is inactive." };
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, discountCents: 0, reason: "Coupon has expired." };
  }
  if (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, discountCents: 0, reason: "Usage limit reached." };
  }
  if (coupon.minSubtotalCents != null && subtotalCents < coupon.minSubtotalCents) {
    return {
      valid: false,
      discountCents: 0,
      reason: `Minimum subtotal ${coupon.minSubtotalCents / 100} required.`,
    };
  }

  let discountCents = 0;
  if (coupon.type === "percentage") {
    discountCents = Math.round(subtotalCents * (coupon.value / 100));
  } else {
    discountCents = coupon.value;
  }
  discountCents = Math.min(discountCents, subtotalCents);

  if (customerId && coupon.redeemedBy.includes(customerId)) {
    return { valid: false, discountCents: 0, reason: "Already redeemed by this user." };
  }

  return { valid: true, discountCents };
}
