"use client";

import Link from "next/link";
import { useState } from "react";

import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/admin-states";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import type { PaymentOrder, PaymentOrderStatus } from "@/lib/types/admin";

const statuses: Array<PaymentOrderStatus | ""> = [
  "",
  "PAID",
  "PAYMENT_PENDING",
  "CREATED",
  "PAYMENT_FAILED",
];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<PaymentOrderStatus | "">("");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const { data, loading, error, refresh } = useAdminQuery(
    () =>
      adminApi
        .orders({
          status: status || undefined,
          q: search || undefined,
          sort,
        })
        .then((r) => r.items as PaymentOrder[]),
    [status, search, sort],
  );

  return (
    <AdminShell title="Orders & purchases">
      <div className="mb-4 flex flex-wrap gap-2">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(q);
          }}
        >
          <Input
            placeholder="Search order id, customer, items…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-64"
          />
          <button type="submit" className="rounded-lg border px-3 text-sm hover:bg-accent">
            Search
          </button>
        </form>
        <select
          className="h-9 rounded-lg border px-3 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as PaymentOrderStatus | "")}
        >
          {statuses.map((s) => (
            <option key={s || "all"} value={s}>
              {s || "All statuses"}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-lg border px-3 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="amount_desc">Amount ↓</option>
          <option value="amount_asc">Amount ↑</option>
        </select>
      </div>

      {loading ? <AdminLoading /> : null}
      {error ? <AdminError message={error} onRetry={refresh} /> : null}
      {!loading && !error && data?.length === 0 ? <AdminEmpty title="No orders" /> : null}

      {!loading && !error && data && data.length > 0 ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((order) => (
                <TableRow key={`${order.customerId}-${order.id}`}>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/users/${order.customerId}`}
                      className="text-primary hover:underline"
                    >
                      {order.customerId.slice(0, 8)}…
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {order.lines.map((l) => l.title).join(", ")}
                  </TableCell>
                  <TableCell>{formatMoney(order.amountCents, order.currency)}</TableCell>
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
                  <TableCell>{formatDate(order.paidAt ?? order.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </AdminShell>
  );
}
