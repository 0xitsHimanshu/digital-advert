import { getCatalogService } from "./catalog-services.js";

export const CART_TAX_RATE = 0.18;

export type CartLineInput = {
  serviceId: string;
  quantity: number;
};

export type PricedCartLine = {
  serviceId: string;
  quantity: number;
  title: string;
  unitPriceCents: number;
  lineTotalCents: number;
};

export type CartPricing = {
  lines: PricedCartLine[];
  currency: string;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
};

function computeDiscountCents(
  subtotalCents: number,
  couponCode: string | undefined,
  adDiscountUnlocked: boolean,
): number {
  if (subtotalCents <= 0) return 0;

  let discount = 0;
  const code = couponCode?.trim().toUpperCase();

  if (code === "WELCOME10") {
    discount = Math.round(subtotalCents * 0.1);
  } else if (code === "SAVE50") {
    discount = subtotalCents >= 30000 ? 5000 : 0;
  } else if (code === "BUNDLE15") {
    discount = Math.round(subtotalCents * 0.15);
  }

  if (adDiscountUnlocked) {
    discount = Math.max(discount, Math.round(subtotalCents * 0.05));
  }

  return Math.min(discount, subtotalCents);
}

export function priceCart(
  items: CartLineInput[],
  options?: { couponCode?: string; adDiscountUnlocked?: boolean },
): CartPricing | { error: string } {
  if (!items.length) {
    return { error: "Cart is empty." };
  }

  const lines: PricedCartLine[] = [];
  let currency: string | null = null;

  for (const item of items) {
    const qty = Math.floor(Number(item.quantity));
    if (!Number.isFinite(qty) || qty < 1) {
      return { error: "Invalid quantity." };
    }

    const service = getCatalogService(item.serviceId);
    if (!service?.isAvailable) {
      return { error: `Service unavailable: ${item.serviceId}` };
    }
    if (service.priceCents == null) {
      return { error: `${service.title} has no price.` };
    }

    if (currency && service.currency !== currency) {
      return { error: "All cart items must use the same currency." };
    }
    currency = service.currency;

    lines.push({
      serviceId: service.id,
      quantity: qty,
      title: service.title,
      unitPriceCents: service.priceCents,
      lineTotalCents: service.priceCents * qty,
    });
  }

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const discountCents = computeDiscountCents(
    subtotalCents,
    options?.couponCode,
    options?.adDiscountUnlocked ?? false,
  );
  const taxableCents = Math.max(0, subtotalCents - discountCents);
  const taxCents = Math.round(taxableCents * CART_TAX_RATE);
  const totalCents = taxableCents + taxCents;

  return {
    lines,
    currency: currency ?? "USD",
    subtotalCents,
    discountCents,
    taxCents,
    totalCents,
  };
}
