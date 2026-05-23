import { create } from "zustand";

import { normalizeCatalogService } from "@/src/lib/app-currency";
import { listCatalogServices } from "@/src/services/services-api";
import {
  clearCachedCart,
  loadCachedCart,
  saveCachedCart,
} from "@/src/services/session-cart-cache";
import type { CartLine } from "@/src/types/cart";
import type { CatalogService } from "@/src/types/service";

export type { CartLine } from "@/src/types/cart";

type CartState = {
  lines: CartLine[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  /** Refresh cached line prices/currency from the catalog API. */
  syncFromCatalog: () => Promise<void>;
  addService: (service: CatalogService) => void;
  removeService: (serviceId: string) => void;
  setQuantity: (serviceId: string, quantity: number) => void;
  getQuantity: (serviceId: string) => number;
  clear: () => Promise<void>;
};

function sumQuantity(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

function persistLines(lines: CartLine[]): void {
  void saveCachedCart(lines);
}

function normalizeLine(line: CartLine): CartLine {
  return { ...line, service: normalizeCatalogService(line.service) };
}

async function refreshCartLinesFromCatalog(lines: CartLine[]): Promise<CartLine[]> {
  const normalized = lines.map(normalizeLine);
  try {
    const catalog = await listCatalogServices({ fallbackToMock: true });
    const byId = new Map(catalog.map((s) => [s.id, s]));
    return normalized.map((line) => {
      const fresh = byId.get(line.serviceId);
      return fresh ? { ...line, service: fresh } : line;
    });
  } catch {
    return normalized;
  }
}

export const useCart = create<CartState>((set, get) => ({
  lines: [],
  hydrated: false,

  hydrate: async () => {
    const cached = await loadCachedCart();
    const lines = await refreshCartLinesFromCatalog(cached);
    if (lines.length > 0) {
      await saveCachedCart(lines);
    }
    set({ lines, hydrated: true });
  },

  syncFromCatalog: async () => {
    const { lines, hydrated } = get();
    if (lines.length === 0) return;

    const refreshed = await refreshCartLinesFromCatalog(lines);
    const changed =
      refreshed.length !== lines.length ||
      refreshed.some((line, i) => {
        const prev = lines[i];
        return (
          !prev ||
          line.service.currency !== prev.service.currency ||
          line.service.priceCents !== prev.service.priceCents
        );
      });

    if (!changed) return;

    if (hydrated) await saveCachedCart(refreshed);
    set({ lines: refreshed });
  },

  addService: (service) => {
    if (!service.isAvailable) return;
    const normalized = normalizeCatalogService(service);

    set((state) => {
      const existing = state.lines.find((l) => l.serviceId === normalized.id);
      const lines = existing
        ? state.lines.map((l) =>
            l.serviceId === normalized.id
              ? { ...l, quantity: l.quantity + 1, service: normalized }
              : l,
          )
        : [...state.lines, { serviceId: normalized.id, quantity: 1, service: normalized }];

      if (state.hydrated) persistLines(lines);
      return { lines };
    });
  },

  removeService: (serviceId) => {
    set((state) => {
      const lines = state.lines.filter((l) => l.serviceId !== serviceId);
      if (state.hydrated) persistLines(lines);
      return { lines };
    });
  },

  setQuantity: (serviceId, quantity) => {
    if (quantity <= 0) {
      get().removeService(serviceId);
      return;
    }
    set((state) => {
      const lines = state.lines.map((l) =>
        l.serviceId === serviceId ? { ...l, quantity } : l,
      );
      if (state.hydrated) persistLines(lines);
      return { lines };
    });
  },

  getQuantity: (serviceId) => {
    return get().lines.find((l) => l.serviceId === serviceId)?.quantity ?? 0;
  },

  clear: async () => {
    set({ lines: [] });
    await clearCachedCart();
  },
}));

export function selectCartItemCount(state: CartState): number {
  return sumQuantity(state.lines);
}
