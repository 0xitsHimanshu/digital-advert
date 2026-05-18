/** DiceBear API v9 — stable avatar URL from a seed (uid or phone). */
export function buildDiceBearAvatarUrl(seed: string): string {
  const normalized = seed.trim() || "guest";
  return `https://api.dicebear.com/9.x/lorelei/png?seed=${encodeURIComponent(normalized)}&size=256`;
}
