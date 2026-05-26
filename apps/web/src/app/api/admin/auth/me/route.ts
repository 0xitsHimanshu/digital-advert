import { requireAdminApi, jsonOk } from "@/lib/api/admin-route";

export async function GET() {
  const { error, session } = await requireAdminApi();
  if (error) return error;
  return jsonOk({ admin: session!.admin });
}
