"use client";

import Link from "next/link";
import { useState } from "react";

import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/admin-states";
import { AdminShell } from "@/components/admin/admin-shell";
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
import type { UserListItem } from "@/lib/types/admin";

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const { data, loading, error, refresh } = useAdminQuery(
    () => adminApi.users(search).then((r) => r.items as UserListItem[]),
    [search],
  );

  return (
    <AdminShell title="Users">
      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(q);
        }}
      >
        <Input
          placeholder="Search name, email, phone, uid…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-md"
        />
        <button
          type="submit"
          className="rounded-lg border px-4 text-sm font-medium hover:bg-accent"
        >
          Search
        </button>
      </form>

      {loading ? <AdminLoading /> : null}
      {error ? <AdminError message={error} onRetry={refresh} /> : null}
      {!loading && !error && data?.length === 0 ? (
        <AdminEmpty title="No users found" description="Customers appear after mobile signup." />
      ) : null}

      {!loading && !error && data && data.length > 0 ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Last active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>
                    <Link href={`/admin/users/${user.uid}`} className="font-medium hover:underline">
                      {user.name || "—"}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div>{user.phoneNumber || "—"}</div>
                    <div className="text-xs">{user.email ?? ""}</div>
                  </TableCell>
                  <TableCell>{user.orderCount}</TableCell>
                  <TableCell>{formatMoney(user.totalSpentCents)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.lastActiveAt ?? user.updatedAt)}
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
