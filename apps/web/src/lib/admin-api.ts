/** Client-side fetch wrapper for admin API routes (session cookie is sent automatically). */

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(
      typeof data === "object" && data && "error" in data && data.error
        ? String(data.error)
        : `Request failed (${res.status})`,
    );
  }
  return data;
}

export const adminApi = {
  me: () => request<{ admin: { uid: string; email: string; role: string } }>("/api/admin/auth/me"),
  logout: () => request<{ ok: boolean }>("/api/admin/auth/logout", { method: "POST" }),
  users: (q?: string) =>
    request<{ count: number; items: unknown[] }>(
      `/api/admin/users${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    ),
  user: (id: string) => request<unknown>(`/api/admin/users/${id}`),
  services: () => request<{ count: number; items: unknown[] }>("/api/admin/services"),
  createService: (body: unknown) =>
    request<{ item: unknown }>("/api/admin/services", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateService: (id: string, body: unknown) =>
    request<{ item: unknown }>(`/api/admin/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteService: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/services?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  coupons: () => request<{ count: number; items: unknown[] }>("/api/admin/coupons"),
  createCoupon: (body: unknown) =>
    request<{ item: unknown }>("/api/admin/coupons", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateCoupon: (id: string, body: unknown) =>
    request<{ item: unknown }>(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteCoupon: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/coupons?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  validateCoupon: (body: { code: string; subtotalCents: number; customerId?: string }) =>
    request<{ valid: boolean; discountCents: number; reason?: string }>(
      "/api/admin/coupons",
      { method: "PUT", body: JSON.stringify(body) },
    ),
  orders: (params?: { status?: string; q?: string; sort?: string }) => {
    const sp = new URLSearchParams();
    if (params?.status) sp.set("status", params.status);
    if (params?.q) sp.set("q", params.q);
    if (params?.sort) sp.set("sort", params.sort);
    const qs = sp.toString();
    return request<{ count: number; items: unknown[] }>(
      `/api/admin/orders${qs ? `?${qs}` : ""}`,
    );
  },
  carts: (hours?: number) =>
    request<{ count: number; items: unknown[]; exportRows: unknown[] }>(
      `/api/admin/carts${hours != null ? `?hours=${hours}` : ""}`,
    ),
  analytics: () => request<{ summary: unknown }>("/api/admin/analytics"),
};
