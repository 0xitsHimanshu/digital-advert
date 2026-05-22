/** Home / Service Detail recommended card accent themes (Figma popular services). */
export const SERVICE_CARD_THEMES = [
  {
    arrowGradient: "orange" as const,
    bg: "#fffaef",
    border: "#ea9400",
    gradient: { from: "#FFDFA9", to: "#EA9400" },
  },
  {
    arrowGradient: "blue" as const,
    bg: "#f5f9ff",
    border: "#064bb3",
    gradient: { from: "#C8DEFF", to: "#064BB3" },
  },
  {
    arrowGradient: "purple" as const,
    bg: "#fffaff",
    border: "#f67cff",
    gradient: { from: "#F0C8FF", to: "#F67CFF" },
  },
] as const;

export type ServiceCardTheme = (typeof SERVICE_CARD_THEMES)[number];

export function getServiceCardTheme(index: number): ServiceCardTheme {
  return SERVICE_CARD_THEMES[index % SERVICE_CARD_THEMES.length]!;
}

/** Figma Home “popular services” card — single source for width/height (1080 artboard). */
export const HOME_SERVICE_CARD_LAYOUT = {
  width: 408,
  borderRadius: 46,
  imageInset: 19,
  imageRadius: 32,
  imageHeight: 250,
  titleFontSize: 38,
  titleLineHeight: 55,
  titleLines: 1,
  descFontSize: 24,
  descLineHeight: 23,
  descLines: 3,
  bodyPaddingTop: 4,
  bodyPaddingBottom: 18,
  arrowMarginTop: 4,
  arrowSize: 80,
  arrowIconSize: 32,
} as const;

/** Total card height used on Home popular services and Service Detail recommended. */
export function getHomeServiceCardHeight(s: (v: number) => number): number {
  const L = HOME_SERVICE_CARD_LAYOUT;
  return (
    s(L.imageInset) * 2 +
    s(L.imageHeight) +
    s(L.bodyPaddingTop) +
    s(L.titleLineHeight) * L.titleLines +
    s(L.descLineHeight) * L.descLines +
    s(L.arrowMarginTop) +
    s(L.arrowSize) +
    s(L.bodyPaddingBottom)
  );
}
