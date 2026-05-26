"use client";

import { useState } from "react";

import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/admin-states";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
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
import { formatDate } from "@/lib/services/format";
import type { Coupon } from "@/lib/types/admin";

export default function AdminCouponsPage() {
  const { data, loading, error, refresh } = useAdminQuery(
    () => adminApi.coupons().then((r) => r.items as Coupon[]),
    [],
  );
  const [form, setForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "10",
    minSubtotalCents: "",
    expiresAt: "",
    usageLimit: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);

  async function createCoupon(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createCoupon({
        code: form.code.toUpperCase(),
        type: form.type,
        value: Number(form.value),
        minSubtotalCents: form.minSubtotalCents ? Number(form.minSubtotalCents) : undefined,
        expiresAt: form.expiresAt || undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        active: form.active,
      });
      setForm({
        code: "",
        type: "percentage",
        value: "10",
        minSubtotalCents: "",
        expiresAt: "",
        usageLimit: "",
        active: true,
      });
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(coupon: Coupon) {
    await adminApi.updateCoupon(coupon.id, { active: !coupon.active });
    refresh();
  }

  return (
    <AdminShell title="Coupons & discounts">
      <form
        onSubmit={createCoupon}
        className="mb-6 grid gap-3 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="space-y-2">
          <Label>Code</Label>
          <Input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <select
            className="flex h-9 w-full rounded-lg border border-input px-3 text-sm"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as "percentage" | "fixed" })
            }
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed (cents)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Value</Label>
          <Input
            type="number"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Usage limit</Label>
          <Input
            type="number"
            value={form.usageLimit}
            onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Min subtotal (cents)</Label>
          <Input
            type="number"
            value={form.minSubtotalCents}
            onChange={(e) => setForm({ ...form, minSubtotalCents: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Expires at</Label>
          <Input
            type="datetime-local"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={saving}>
            Create coupon
          </Button>
        </div>
      </form>

      {loading ? <AdminLoading /> : null}
      {error ? <AdminError message={error} onRetry={refresh} /> : null}
      {!loading && !error && data?.length === 0 ? <AdminEmpty title="No coupons" /> : null}

      {!loading && !error && data && data.length > 0 ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono">{coupon.code}</TableCell>
                  <TableCell>
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : `${coupon.value} cents`}
                  </TableCell>
                  <TableCell>
                    {coupon.usageCount}
                    {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : ""}
                  </TableCell>
                  <TableCell>{formatDate(coupon.expiresAt)}</TableCell>
                  <TableCell>
                    <Badge variant={coupon.active ? "success" : "secondary"}>
                      {coupon.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => toggleActive(coupon)}>
                      Toggle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </AdminShell>
  );
}
