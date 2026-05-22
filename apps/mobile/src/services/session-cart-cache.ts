import * as SecureStore from "expo-secure-store";

import type { CartLine } from "@/src/types/cart";
import type { CatalogService } from "@/src/types/service";

const CART_CACHE_KEY = "digital_advert.cart_cache";

function isCatalogService(value: unknown): value is CatalogService {
  if (!value || typeof value !== "object") return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.title === "string" &&
    typeof s.description === "string" &&
    typeof s.imageUrl === "string" &&
    typeof s.isAvailable === "boolean" &&
    (s.priceCents === null || typeof s.priceCents === "number") &&
    typeof s.currency === "string"
  );
}

function parseCartLines(raw: string): CartLine[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    const lines: CartLine[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const row = entry as Record<string, unknown>;
      const serviceId = typeof row.serviceId === "string" ? row.serviceId : "";
      const quantity =
        typeof row.quantity === "number" && row.quantity > 0
          ? Math.floor(row.quantity)
          : 0;
      if (!serviceId || quantity <= 0 || !isCatalogService(row.service)) continue;
      if (row.service.id !== serviceId) continue;
      lines.push({ serviceId, quantity, service: row.service });
    }
    return lines;
  } catch {
    return [];
  }
}

export async function saveCachedCart(lines: CartLine[]): Promise<void> {
  await SecureStore.setItemAsync(CART_CACHE_KEY, JSON.stringify(lines));
}

export async function loadCachedCart(): Promise<CartLine[]> {
  const raw = await SecureStore.getItemAsync(CART_CACHE_KEY);
  if (!raw) return [];
  return parseCartLines(raw);
}

export async function clearCachedCart(): Promise<void> {
  await SecureStore.deleteItemAsync(CART_CACHE_KEY);
}
