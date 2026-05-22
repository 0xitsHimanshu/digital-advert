import { describe, expect, it } from "vitest";

import { computeCartTotals, computeDiscountCents } from "@/src/lib/cart-totals";
import { CART_COUPONS } from "@/src/types/cart-coupon";
import type { CartLine } from "@/src/types/cart";

const line: CartLine = {
  serviceId: "a",
  quantity: 2,
  service: {
    id: "a",
    title: "Test",
    description: "",
    imageUrl: "",
    priceCents: 10000,
    currency: "USD",
    isAvailable: true,
  },
};

describe("computeCartTotals", () => {
  it("sums subtotal from line quantities", () => {
    const totals = computeCartTotals([line], null, false);
    expect(totals.subtotalCents).toBe(20000);
    expect(totals.serviceCount).toBe(2);
    expect(totals.lineCount).toBe(1);
  });

  it("applies percent coupon discount before tax", () => {
    const totals = computeCartTotals([line], CART_COUPONS[0], false);
    expect(totals.discountCents).toBe(2000);
    expect(totals.taxCents).toBe(Math.round(18000 * 0.18));
    expect(totals.totalCents).toBe(18000 + totals.taxCents);
  });

  it("uses ad discount when higher than coupon", () => {
    const discount = computeDiscountCents(20000, CART_COUPONS[0], true);
    expect(discount).toBe(2000);
  });
});
