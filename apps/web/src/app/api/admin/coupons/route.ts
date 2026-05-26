import { z } from "zod";

import { requireAdminApi, jsonOk, jsonError } from "@/lib/api/admin-route";
import {
  deleteCoupon,
  listCoupons,
  upsertCoupon,
  validateCouponForCart,
} from "@/lib/services/firestore-coupons";

const couponSchema = z.object({
  code: z.string().min(2),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().positive(),
  minSubtotalCents: z.number().optional(),
  expiresAt: z.string().optional(),
  usageLimit: z.number().optional(),
  active: z.boolean(),
});

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const items = await listCoupons();
  return jsonOk({ count: items.length, items });
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const body = couponSchema.parse(await request.json());
    const item = await upsertCoupon({
      id: body.code.toUpperCase(),
      code: body.code.toUpperCase(),
      type: body.type,
      value: body.value,
      minSubtotalCents: body.minSubtotalCents,
      expiresAt: body.expiresAt,
      usageLimit: body.usageLimit,
      usageCount: 0,
      redeemedBy: [],
      active: body.active,
    });
    return jsonOk({ item }, { status: 201 });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Invalid coupon");
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return jsonError("Missing id");
  await deleteCoupon(id);
  return jsonOk({ ok: true });
}

/** POST validate? — query subtotal for preview */
export async function PUT(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const body = z
    .object({
      code: z.string(),
      subtotalCents: z.number(),
      customerId: z.string().optional(),
    })
    .parse(await request.json());

  const { getCouponByCode } = await import("@/lib/services/firestore-coupons");
  const coupon = await getCouponByCode(body.code);
  if (!coupon) return jsonOk({ valid: false, discountCents: 0, reason: "Coupon not found." });

  const result = validateCouponForCart(coupon, body.subtotalCents, body.customerId);
  return jsonOk(result);
}
