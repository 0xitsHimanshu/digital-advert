/** DiceBear v9 Lorelei — one seed per signup from this curated list. */
export const DICEBEAR_AVATAR_SEEDS = [
  "Leah",
  "Avery",
  "Sarah",
  "Jocelyn",
  "Emery",
  "Jameson",
  "Eden",
  "Ryker",
  "Kingston",
  "Sadie",
  "Eliza",
  "Leo",
  "Mason",
  "Easton",
  "Adrian",
  "Valentina",
  "Wyatt",
  "Jack",
  "Sophia",
] as const;

/** Picks a random Lorelei seed for a new signup (call once per onboarding session). */
export function pickRandomAvatarSeed(): string {
  const index = Math.floor(Math.random() * DICEBEAR_AVATAR_SEEDS.length);
  return DICEBEAR_AVATAR_SEEDS[index] ?? "Leah";
}

export function buildDiceBearAvatarUrl(seed: string): string {
  const normalized = seed.trim() || "Leah";
  return `https://api.dicebear.com/9.x/lorelei/png?seed=${encodeURIComponent(normalized)}&size=256`;
}
