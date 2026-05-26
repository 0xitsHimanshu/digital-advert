/** Convert rupee input (e.g. "499" or "499.50") to integer cents for Firestore. */
export function rupeesToCents(rupees: string): number | null {
  const trimmed = rupees.trim();
  if (!trimmed) return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

/** Convert stored cents to a rupee string for form inputs. */
export function centsToRupeesInput(cents: number): string {
  const rupees = cents / 100;
  return Number.isInteger(rupees) ? String(rupees) : rupees.toFixed(2).replace(/\.?0+$/, "");
}

/** Format cents as INR currency string */
export function formatMoney(cents: number, currency = "INR"): string {
  const amount = cents / 100;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

export function formatDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
