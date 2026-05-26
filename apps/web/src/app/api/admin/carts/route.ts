import { requireAdminApi, jsonOk } from "@/lib/api/admin-route";
import { CART_ABANDONMENT_HOURS } from "@/lib/firebase/config";
import { listAbandonedCarts } from "@/lib/services/firestore-customers";

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const hours = Number(searchParams.get("hours") ?? CART_ABANDONMENT_HOURS);
  const items = await listAbandonedCarts(Number.isFinite(hours) ? hours : CART_ABANDONMENT_HOURS);

  return jsonOk({
    count: items.length,
    abandonmentHours: hours,
    items,
    /** Export-friendly shape for sales follow-up */
    exportRows: items.map((row) => ({
      customerId: row.customerId,
      name: row.profile?.name ?? "",
      email: row.contactEmail ?? row.profile?.email ?? "",
      phone: row.contactPhone ?? row.profile?.phoneNumber ?? "",
      cartValueCents: row.estimatedTotalCents,
      itemCount: row.lines.length,
      lastUpdated: row.updatedAt,
      items: row.lines.map((l) => `${l.title ?? l.serviceId} x${l.quantity}`).join("; "),
    })),
  });
}
