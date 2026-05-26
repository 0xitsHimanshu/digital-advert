import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminPage } from "@/lib/auth/require-admin-page";
import { getAnalyticsSummary } from "@/lib/services/firestore-analytics";
import { formatMoney } from "@/lib/services/format";

export default async function AdminDashboardPage() {
  await requireAdminPage();
  const summary = await getAnalyticsSummary();

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total users" value={String(summary.totalUsers)} />
        <StatCard title="Active (30d)" value={String(summary.activeUsers30d)} />
        <StatCard title="Revenue" value={formatMoney(summary.totalRevenueCents)} />
        <StatCard title="Abandoned carts" value={String(summary.pendingCarts)} />
        <StatCard title="Coupon redemptions" value={String(summary.couponRedemptions)} />
        <StatCard
          title="Paid orders"
          value={String(summary.ordersByStatus.PAID)}
          hint={`${summary.ordersByStatus.PAYMENT_PENDING} pending`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 text-sm">
            <Link className="text-primary underline" href="/admin/users">
              Users
            </Link>
            <Link className="text-primary underline" href="/admin/services">
              Services
            </Link>
            <Link className="text-primary underline" href="/admin/orders">
              Orders
            </Link>
            <Link className="text-primary underline" href="/admin/carts">
              Abandoned carts
            </Link>
            <Link className="text-primary underline" href="/admin/analytics">
              Analytics
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top services</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {summary.topServices.length === 0 ? (
                <li className="text-muted-foreground">No paid orders yet.</li>
              ) : (
                summary.topServices.slice(0, 5).map((s) => (
                  <li key={s.serviceId} className="flex justify-between gap-4">
                    <span>{s.title}</span>
                    <span className="text-muted-foreground">{formatMoney(s.revenueCents)}</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
