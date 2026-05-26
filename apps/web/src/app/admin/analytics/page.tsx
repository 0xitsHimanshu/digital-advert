"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AdminError, AdminLoading } from "@/components/admin/admin-states";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminQuery } from "@/hooks/use-admin-api";
import { adminApi } from "@/lib/admin-api";
import { formatMoney } from "@/lib/services/format";
import type { AnalyticsSummary } from "@/lib/types/admin";

export default function AdminAnalyticsPage() {
  const { data, loading, error, refresh } = useAdminQuery(
    () => adminApi.analytics().then((r) => r.summary as AnalyticsSummary),
    [],
  );

  const chartData =
    data?.revenueByDay.map((d) => ({
      date: d.date.slice(5),
      revenue: d.revenueCents / 100,
      orders: d.orderCount,
    })) ?? [];

  return (
    <AdminShell title="Analytics">
      {loading ? <AdminLoading rows={8} /> : null}
      {error ? <AdminError message={error} onRetry={refresh} /> : null}

      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard title="Total users" value={String(data.totalUsers)} />
            <StatCard title="Active users (30d)" value={String(data.activeUsers30d)} />
            <StatCard title="Total revenue" value={formatMoney(data.totalRevenueCents)} />
            <StatCard title="Abandoned carts" value={String(data.pendingCarts)} />
            <StatCard title="Coupon redemptions" value={String(data.couponRedemptions)} />
            <StatCard title="Paid orders" value={String(data.ordersByStatus.PAID)} />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue (last 14 days)</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                {chartData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No paid orders in range.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top selling services</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {data.topServices.map((s) => (
                    <li key={s.serviceId} className="flex justify-between gap-4">
                      <span>
                        {s.title}{" "}
                        <span className="text-muted-foreground">×{s.quantity}</span>
                      </span>
                      <span>{formatMoney(s.revenueCents)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Orders by status</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              {Object.entries(data.ordersByStatus).map(([status, count]) => (
                <div key={status} className="rounded-lg border p-3">
                  <p className="text-muted-foreground">{status}</p>
                  <p className="text-xl font-semibold">{count}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : null}
    </AdminShell>
  );
}
