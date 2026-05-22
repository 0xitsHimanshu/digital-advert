import { create } from "zustand";

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

export const useCart = create<CartState>((set, get) => ({
  lines: [],
  hydrated: false,

  hydrate: async () => {
    const lines = await loadCachedCart();
    set({ lines, hydrated: true });
  },

  addService: (service) => {
    if (!service.isAvailable) return;

    set((state) => {
      const existing = state.lines.find((l) => l.serviceId === service.id);
      const lines = existing
        ? state.lines.map((l) =>
            l.serviceId === service.id ? { ...l, quantity: l.quantity + 1 } : l,
          )
        : [...state.lines, { serviceId: service.id, quantity: 1, service }];

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
