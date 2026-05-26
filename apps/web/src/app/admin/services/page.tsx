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
import { centsToRupeesInput, formatMoney, rupeesToCents } from "@/lib/services/format";
import type { CatalogService } from "@/lib/types/admin";

const emptyForm = {
  id: "",
  title: "",
  description: "",
  imageUrl: "",
  priceRupees: "",
  currency: "INR",
  isAvailable: true,
  category: "",
  sortOrder: "0",
};

export default function AdminServicesPage() {
  const { data, loading, error, refresh } = useAdminQuery(
    () => adminApi.services().then((r) => r.items as CatalogService[]),
    [],
  );
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function saveService(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const priceCents = rupeesToCents(form.priceRupees);
      if (form.priceRupees.trim() && priceCents === null) {
        alert("Enter a valid price in rupees (e.g. 499 or 499.50).");
        setSaving(false);
        return;
      }

      const payload = {
        id: form.id.trim(),
        title: form.title.trim(),
        description: form.description,
        imageUrl: form.imageUrl,
        priceCents,
        currency: form.currency,
        isAvailable: form.isAvailable,
        category: form.category || undefined,
        sortOrder: Number(form.sortOrder) || 0,
      };
      if (editingId) {
        await adminApi.updateService(editingId, payload);
      } else {
        await adminApi.createService(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(service: CatalogService) {
    setEditingId(service.id);
    setForm({
      id: service.id,
      title: service.title,
      description: service.description,
      imageUrl: service.imageUrl,
      priceRupees:
        service.priceCents == null ? "" : centsToRupeesInput(service.priceCents),
      currency: service.currency,
      isAvailable: service.isAvailable,
      category: service.category ?? "",
      sortOrder: String(service.sortOrder),
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this service?")) return;
    await adminApi.deleteService(id);
    refresh();
  }

  return (
    <AdminShell title="Services">
      <CardForm
        form={form}
        setForm={setForm}
        editingId={editingId}
        saving={saving}
        onSubmit={saveService}
        onCancel={() => {
          setEditingId(null);
          setForm(emptyForm);
        }}
      />

      {loading ? <AdminLoading /> : null}
      {error ? <AdminError message={error} onRetry={refresh} /> : null}

      {!loading && !error && data?.length === 0 ? (
        <AdminEmpty title="No services" description="Create your first catalog service." />
      ) : null}

      {!loading && !error && data && data.length > 0 ? (
        <div className="mt-6 rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="font-medium">{service.title}</div>
                    <div className="text-xs text-muted-foreground">{service.id}</div>
                  </TableCell>
                  <TableCell>
                    {service.priceCents != null
                      ? formatMoney(service.priceCents, service.currency)
                      : "—"}
                  </TableCell>
                  <TableCell>{service.isAvailable ? "Yes" : "No"}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button variant="outline" size="sm" onClick={() => startEdit(service)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => remove(service.id)}>
                      Delete
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

function CardForm({
  form,
  setForm,
  editingId,
  saving,
  onSubmit,
  onCancel,
}: {
  form: typeof emptyForm;
  setForm: (v: typeof emptyForm) => void;
  editingId: string | null;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div className="space-y-2">
        <Label>ID (slug)</Label>
        <Input
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
          disabled={Boolean(editingId)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label>Description</Label>
        <Input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Price (₹)</Label>
        <Input
          type="number"
          min={0}
          step="0.01"
          placeholder="e.g. 499"
          value={form.priceRupees}
          onChange={(e) => setForm({ ...form, priceRupees: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">Stored as paise/cents in the database.</p>
      </div>
      <div className="space-y-2">
        <Label>Sort order</Label>
        <Input
          type="number"
          value={form.sortOrder}
          onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
        />
      </div>
      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
        <Button type="submit" disabled={saving}>
          {editingId ? "Update service" : "Create service"}
        </Button>
        {editingId ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
