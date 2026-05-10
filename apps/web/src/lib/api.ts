export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type Ad = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaUrl: string;
  createdAt: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}

export const api = {
  health: () =>
    request<{ status: string; uptime: number; timestamp: string }>(
      "/api/health",
    ),
  listAds: () => request<{ count: number; items: Ad[] }>("/api/ads"),
  getAd: (id: string) => request<Ad>(`/api/ads/${id}`),
  createAd: (body: Partial<Ad>) =>
    request<Ad>("/api/ads", { method: "POST", body: JSON.stringify(body) }),
};
