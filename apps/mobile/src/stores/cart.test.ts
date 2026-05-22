import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/src/services/session-cart-cache", () => ({
  saveCachedCart: vi.fn(async () => undefined),
  loadCachedCart: vi.fn(async () => []),
  clearCachedCart: vi.fn(async () => undefined),
}));

import { useCart } from "@/src/stores/cart";
import type { CatalogService } from "@/src/types/service";

const service: CatalogService = {
  id: "svc_1",
  title: "Test Service",
  description: "Desc",
  imageUrl: "https://example.com/img.jpg",
  priceCents: 1000,
  currency: "USD",
  isAvailable: true,
};

describe("useCart", () => {
  beforeEach(() => {
    useCart.setState({ lines: [], hydrated: true });
  });

  it("adds a new line", () => {
    useCart.getState().addService(service);
    expect(useCart.getState().lines).toHaveLength(1);
    expect(useCart.getState().getQuantity("svc_1")).toBe(1);
  });

  it("increments quantity for existing service", () => {
    useCart.getState().addService(service);
    useCart.getState().addService(service);
    expect(useCart.getState().getQuantity("svc_1")).toBe(2);
  });

  it("does not add unavailable services", () => {
    useCart.getState().addService({ ...service, isAvailable: false });
    expect(useCart.getState().lines).toHaveLength(0);
  });
});
