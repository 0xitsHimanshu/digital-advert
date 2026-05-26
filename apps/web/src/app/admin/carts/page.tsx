"use client";

import { useState } from "react";

import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/admin-states";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { CustomerCartSnapshot, CustomerProfile } from "@/lib/types/admin";

type CartRow = CustomerCartSnapshot & { profile: CustomerProfile | null };
type CartsResponse = {
  count: number;
  abandonmentHours: number;
  items: CartRow[];
  exportRows: Array<{
    customerId: string;
    name: string;
    email: string;
    phone: string;
    cartValueCents: number;
    itemCount: number;
    lastUpdated: string;
    items: string;
  }>;
};

export default function AdminCartsPage() {
  const [hours, setHours] = useState("24");
  const [appliedHours, setAppliedHours] = useState(24);

  const { data, loading, error, refresh } = useAdminQuery(
    () => adminApi.carts(appliedHours) as Promise<CartsResponse>,
    [appliedHours],
  );

  function exportCsv() {
    if (!data?.exportRows.length) return;
    const headers = [
      "customerId",
      "name",
      "email",
      "phone",
      "cartValueCents",
      "itemCount",
      "lastUpdated",
      "items",
    ];
    const rows = data.exportRows.map((r) =>
      headers.map((h) => JSON.stringify(String(r[h as keyof typeof r] ?? ""))).join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `abandoned-carts-${appliedHours}h.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell title="Cart abandonment">
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label>Inactive for (hours)</Label>
          <Input
            type="number"
            className="w-32"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => setAppliedHours(Number(hours) || 24)}
        >
          Apply
        </Button>
        <Button variant="outline" onClick={exportCsv} disabled={!data?.exportRows.length}>
          Export CSV
        </Button>
      </div>

      {loading ? <AdminLoading /> : null}
      {error ? <AdminError message={error} onRetry={refresh} /> : null}
      {!loading && !error && data?.items.length === 0 ? (
        <AdminEmpty
          title="No abandoned carts"
          description={`No carts inactive for ${appliedHours}+ hours.`}
        />
      ) : null}

      {!loading && !error && data && data.items.length > 0 ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Last update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((row) => (
                <TableRow key={row.customerId}>
                  <TableCell>{row.profile?.name ?? row.customerId}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div>{row.contactPhone ?? row.profile?.phoneNumber}</div>
                    <div className="text-xs">{row.contactEmail ?? row.profile?.email}</div>
                  </TableCell>
                  <TableCell>{row.lines.length}</TableCell>
                  <TableCell>{formatMoney(row.estimatedTotalCents, row.currency)}</TableCell>
                  <TableCell>{formatDate(row.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </AdminShell>
  );
}
