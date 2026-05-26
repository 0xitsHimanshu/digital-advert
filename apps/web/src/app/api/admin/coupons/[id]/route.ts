import { z } from "zod";

import { requireAdminApi, jsonOk, jsonError } from "@/lib/api/admin-route";
import { getCouponByCode, upsertCoupon } from "@/lib/services/firestore-coupons";

const patchSchema = z.object({
  type: z.enum(["percentage", "fixed"]).optional(),
  value: z.number().positive().optional(),
  minSubtotalCents: z.number().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  usageLimit: z.number().nullable().optional(),
  active: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  const existing = await getCouponByCode(id);
  if (!existing) return jsonError("Not found", 404);

  try {
    const patch = patchSchema.parse(await request.json());
    const item = await upsertCoupon({
      ...existing,
      ...patch,
      minSubtotalCents:
        patch.minSubtotalCents === null ? undefined : (patch.minSubtotalCents ?? existing.minSubtotalCents),
      expiresAt:
        patch.expiresAt === null ? undefined : (patch.expiresAt ?? existing.expiresAt),
      usageLimit:
        patch.usageLimit === null ? undefined : (patch.usageLimit ?? existing.usageLimit),
    });
    return jsonOk({ item });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Invalid patch");
  }
}
