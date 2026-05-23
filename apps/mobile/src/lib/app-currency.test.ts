import { describe, expect, it } from "vitest";

import {
  APP_CURRENCY,
  normalizeCatalogCurrency,
  normalizeCatalogService,
} from "@/src/lib/app-currency";

describe("app-currency", () => {
  it("maps legacy USD to INR", () => {
    expect(normalizeCatalogCurrency("USD")).toBe(APP_CURRENCY);
    expect(normalizeCatalogCurrency("")).toBe(APP_CURRENCY);
    expect(normalizeCatalogCurrency("INR")).toBe("INR");
  });

  it("normalizes service snapshot currency", () => {
    const service = normalizeCatalogService({
      id: "a",
      title: "Test",
      description: "",
      imageUrl: "",
      priceCents: 100,
      currency: "USD",
      isAvailable: true,
    });
    expect(service.currency).toBe("INR");
  });
});
