import type { CartLine } from "@/src/types/cart";
import type { CartCoupon } from "@/src/types/cart-coupon";

/** GST-style rate applied to the taxable amount (after discounts). */
export const CART_TAX_RATE = 0.18;

export type CartTotals = {
  serviceCount: number;
  lineCount: number;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  currency: string;
};

export function sumLineCents(lines: CartLine[]): number {
  return lines.reduce(
    (sum, line) => sum + (line.service.priceCents ?? 0) * line.quantity,
    0,
  );
}

export function resolveCartCurrency(lines: CartLine[]): string {
  return lines.find((l) => l.service.currency)?.service.currency ?? "USD";
}

export function computeDiscountCents(
  subtotalCents: number,
  coupon: CartCoupon | null,
  adDiscountUnlocked: boolean,
): number {
  if (subtotalCents <= 0) return 0;

  let discount = 0;

  if (coupon) {
    if (coupon.kind === "percent") {
      discount = Math.round((subtotalCents * coupon.value) / 100);
    } else {
      discount = coupon.value;
    }
  }

  if (adDiscountUnlocked) {
    const adDiscount = Math.round(subtotalCents * 0.05);
    discount = Math.max(discount, adDiscount);
  }

  return Math.min(discount, subtotalCents);
}

export function computeCartTotals(
  lines: CartLine[],
  coupon: CartCoupon | null,
  adDiscountUnlocked: boolean,
): CartTotals {
  const lineCount = lines.length;
  const serviceCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotalCents = sumLineCents(lines);
  const currency = resolveCartCurrency(lines);
  const discountCents = computeDiscountCents(subtotalCents, coupon, adDiscountUnlocked);
  const taxableCents = Math.max(0, subtotalCents - discountCents);
  const taxCents = Math.round(taxableCents * CART_TAX_RATE);
  const totalCents = taxableCents + taxCents;

  return {
    serviceCount,
    lineCount,
    subtotalCents,
    discountCents,
    taxCents,
    totalCents,
    currency,
  };
}

export function formatCartMoney(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}
