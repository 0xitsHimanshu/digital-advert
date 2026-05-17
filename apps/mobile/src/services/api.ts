import { getApiBaseUrl } from "@/src/lib/api-base-url";

export const API_BASE_URL = getApiBaseUrl();

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
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
    apiRequest<{ status: string; uptime: number; timestamp: string }>(
      "/api/health",
    ),
};
