import { z } from "zod";

import { requireAdminApi, jsonOk, jsonError } from "@/lib/api/admin-route";
import { getService, upsertService } from "@/lib/services/firestore-services";

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  priceCents: z.number().nullable().optional(),
  currency: z.string().optional(),
  isAvailable: z.boolean().optional(),
  category: z.string().optional(),
  sortOrder: z.number().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { id } = await params;
  const item = await getService(id);
  if (!item) return jsonError("Not found", 404);
  return jsonOk({ item });
}

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  const existing = await getService(id);
  if (!existing) return jsonError("Not found", 404);

  try {
    const patch = patchSchema.parse(await request.json());
    const item = await upsertService({ ...existing, ...patch, id });
    return jsonOk({ item });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Invalid patch");
  }
}
