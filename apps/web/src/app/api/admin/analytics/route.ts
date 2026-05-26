import { requireAdminApi, jsonOk } from "@/lib/api/admin-route";
import { getAnalyticsSummary } from "@/lib/services/firestore-analytics";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;
  const summary = await getAnalyticsSummary();
  return jsonOk({ summary });
}
