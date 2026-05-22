import { beforeEach, describe, expect, it, vi } from "vitest";

const secureStoreMock = vi.hoisted(() => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

vi.mock("expo-secure-store", () => secureStoreMock);

import { loadCachedCart, saveCachedCart } from "@/src/services/session-cart-cache";

const validLine = {
  serviceId: "svc_1",
  quantity: 2,
  service: {
    id: "svc_1",
    title: "Digital Marketing",
    description: "Campaigns",
    imageUrl: "https://example.com/a.jpg",
    priceCents: 1000,
    currency: "USD",
    isAvailable: true,
  },
};

describe("session-cart-cache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("round-trips cart lines through secure store", async () => {
    secureStoreMock.getItemAsync.mockResolvedValueOnce(JSON.stringify([validLine]));

    await saveCachedCart([validLine]);
    expect(secureStoreMock.setItemAsync).toHaveBeenCalledWith(
      "digital_advert.cart_cache",
      JSON.stringify([validLine]),
    );

    const loaded = await loadCachedCart();
    expect(loaded).toEqual([validLine]);
  });

  it("returns empty array for invalid payload", async () => {
    secureStoreMock.getItemAsync.mockResolvedValueOnce("{not-json");
    expect(await loadCachedCart()).toEqual([]);
  });
});
