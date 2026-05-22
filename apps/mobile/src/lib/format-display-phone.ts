/** "+91 8762376438" from E.164 (+918762376438). */
export function formatDisplayPhone(e164: string | null | undefined): string {
  if (!e164?.trim()) return "";
  const digits = e164.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2)}`;
  }
  if (digits.length === 10) {
    return `+91 ${digits}`;
  }
  return e164.trim();
}
