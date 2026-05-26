import { requireAdminApi, jsonOk } from "@/lib/api/admin-route";
import { listCustomers } from "@/lib/services/firestore-customers";

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q") ?? undefined;
  const items = await listCustomers(search);
  return jsonOk({ count: items.length, items });
}
