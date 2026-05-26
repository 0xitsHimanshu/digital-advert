import { z } from "zod";

import { requireAdminApi, jsonOk, jsonError } from "@/lib/api/admin-route";
import {
  deleteService,
  listServices,
  upsertService,
} from "@/lib/services/firestore-services";

const serviceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  imageUrl: z.string(),
  priceCents: z.number().nullable(),
  currency: z.string().default("INR"),
  isAvailable: z.boolean(),
  category: z.string().optional(),
  sortOrder: z.number(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const items = await listServices();
  return jsonOk({ count: items.length, items });
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const body = serviceSchema.parse(await request.json());
    const item = await upsertService(body);
    return jsonOk({ item }, { status: 201 });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Invalid service payload");
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return jsonError("Missing id");
  await deleteService(id);
  return jsonOk({ ok: true });
}
