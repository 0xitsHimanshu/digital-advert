import type { CatalogService } from "@/src/types/service";

/** App checkout and catalog display currency (Razorpay / India). */
export const APP_CURRENCY = "INR";

/** Locales that render the correct currency symbol for display. */
export function localeForCurrency(currency: string): string | undefined {
  if (currency === "INR") return "en-IN";
  return undefined;
}

/** Legacy carts stored USD; treat as INR rupee amounts (same minor units). */
export function normalizeCatalogCurrency(currency: string): string {
  if (!currency || currency === "USD") return APP_CURRENCY;
  return currency;
}

export function normalizeCatalogService(service: CatalogService): CatalogService {
  const currency = normalizeCatalogCurrency(service.currency);
  if (currency === service.currency) return service;
  return { ...service, currency };
}
