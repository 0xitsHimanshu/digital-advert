import { requireAdminApi, jsonOk, jsonError } from "@/lib/api/admin-route";
import { getCustomerDetail } from "@/lib/services/firestore-customers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  const detail = await getCustomerDetail(id);
  if (!detail) return jsonError("User not found", 404);
  return jsonOk(detail);
}
