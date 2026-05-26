"use client";

import { useParams } from "next/navigation";

import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/admin-states";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminQuery } from "@/hooks/use-admin-api";
import { adminApi } from "@/lib/admin-api";
import { formatDate, formatMoney } from "@/lib/services/format";
import type {
  ActivityLog,
  CustomerCartSnapshot,
  CustomerProfile,
  PaymentOrder,
} from "@/lib/types/admin";

type UserDetail = {
  profile: CustomerProfile;
  orders: PaymentOrder[];
  cart: CustomerCartSnapshot | null;
  activityLogs: ActivityLog[];
  summary: { orderCount: number; totalSpentCents: number; cartItemCount: number };
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { data, loading, error, refresh } = useAdminQuery(
    () => adminApi.user(id) as Promise<UserDetail>,
    [id],
  );

  return (
    <AdminShell title={data?.profile.name ?? "User detail"}>
      {loading ? <AdminLoading /> : null}
      {error ? <AdminError message={error} onRetry={refresh} /> : null}

      {data ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
              <p>
                <span className="text-muted-foreground">UID:</span> {data.profile.uid}
              </p>
              <p>
                <span className="text-muted-foreground">Phone:</span>{" "}
                {data.profile.phoneNumber || "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span> {data.profile.email ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Signup:</span>{" "}
                {formatDate(data.profile.signupAt ?? data.profile.updatedAt)}
              </p>
              <p>
                <span className="text-muted-foreground">Last active:</span>{" "}
                {formatDate(data.profile.lastActiveAt ?? data.profile.updatedAt)}
              </p>
              <p>
                <span className="text-muted-foreground">Total spent:</span>{" "}
                {formatMoney(data.summary.totalSpentCents)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cart activity</CardTitle>
            </CardHeader>
            <CardContent>
              {!data.cart || data.cart.lines.length === 0 ? (
                <AdminEmpty title="No cart snapshot" />
              ) : (
                <div className="space-y-2 text-sm">
                  <p>
                    {data.cart.lines.length} items · {formatMoney(data.cart.estimatedTotalCents)}{" "}
                    · updated {formatDate(data.cart.updatedAt)}
                  </p>
                  <ul className="list-disc pl-5">
                    {data.cart.lines.map((l) => (
                      <li key={l.serviceId}>
                        {l.title ?? l.serviceId} × {l.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purchase history</CardTitle>
            </CardHeader>
            <CardContent>
              {data.orders.length === 0 ? (
                <AdminEmpty title="No orders" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "PAID"
                                ? "success"
                                : order.status === "PAYMENT_FAILED"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatMoney(order.amountCents, order.currency)}</TableCell>
                        <TableCell>{formatDate(order.paidAt ?? order.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity logs</CardTitle>
            </CardHeader>
            <CardContent>
              {data.activityLogs.length === 0 ? (
                <AdminEmpty
                  title="No activity logs"
                  description="Mobile app can write to customers/{uid}/activity_logs."
                />
              ) : (
                <ul className="space-y-2 text-sm">
                  {data.activityLogs.map((log) => (
                    <li key={log.id} className="flex justify-between gap-4 border-b py-2">
                      <span>
                        <Badge variant="outline" className="mr-2">
                          {log.type}
                        </Badge>
                        {log.label}
                      </span>
                      <span className="shrink-0 text-muted-foreground">
                        {formatDate(log.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </AdminShell>
  );
}
