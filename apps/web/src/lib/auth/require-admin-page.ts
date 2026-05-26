import { redirect } from "next/navigation";

import { verifyAdminSession } from "@/lib/firebase/session";

/** Server guard for protected admin pages. */
export async function requireAdminPage() {
  const session = await verifyAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
