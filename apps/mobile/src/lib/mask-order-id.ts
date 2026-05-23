/** "987545xxxxx6778" — keep ends, mask middle segment. */
export function maskOrderId(orderId: string): string {
  const compact = orderId.replace(/-/g, "");
  if (compact.length <= 10) return compact;
  const head = compact.slice(0, 6);
  const tail = compact.slice(-4);
  return `${head}xxxxx${tail}`;
}
