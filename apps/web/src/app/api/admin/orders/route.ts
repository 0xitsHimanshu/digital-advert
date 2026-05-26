import type { PaymentOrderStatus } from "@/lib/types/admin";

import { requireAdminApi, jsonOk } from "@/lib/api/admin-route";
import { listAllOrders } from "@/lib/services/firestore-orders";

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as PaymentOrderStatus | null;
  const search = searchParams.get("q") ?? undefined;
  const sort = (searchParams.get("sort") as
    | "newest"
    | "oldest"
    | "amount_desc"
    | "amount_asc"
    | null) ?? "newest";

  const items = await listAllOrders({
    status: status ?? undefined,
    search,
    sort,
  });

  return jsonOk({ count: items.length, items });
}
