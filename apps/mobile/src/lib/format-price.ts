import { localeForCurrency, normalizeCatalogCurrency } from "@/src/lib/app-currency";

export function formatServicePrice(priceCents: number | null, currency: string): string | null {
  if (priceCents == null) return null;

  const code = normalizeCatalogCurrency(currency);
  try {
    return new Intl.NumberFormat(localeForCurrency(code), {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(priceCents / 100);
  } catch {
    return `${(priceCents / 100).toFixed(0)} ${code}`;
  }
}
