import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Resolves the backend base URL from `app.json` `extra.apiUrl`, falling back
 * to localhost. On the Android emulator, `localhost` is rewritten to the
 * emulator host alias `10.0.2.2`.
 */
function resolveBaseUrl(): string {
  const fromExtra =
    (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
    (Constants.manifest2?.extra as { apiUrl?: string } | undefined)?.apiUrl;

  const fallback = "http://localhost:4000";
  const url = fromExtra ?? fallback;

  if (Platform.OS === "android" && url.includes("localhost")) {
    return url.replace("localhost", "10.0.2.2");
  }
  return url;
}

export const API_BASE_URL = resolveBaseUrl();

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
