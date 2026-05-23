import { Image, View } from "react-native";

/** Figma 2228:1567 — ellipse positions on the 1080px artboard. */
const ELLIPSES = {
  /** 2228:1624 */
  ellipse34: { left: -154, top: 1620, size: 291, fill: "#EDFFED" },
  /** 2228:1625 */
  ellipse42: { left: -137.18, top: 1636.82, size: 257.367 },
  /** 2228:1622 — left: calc(80% + 84px) */
  ellipse38: { left: 948, top: 1721, size: 264 },
  /** 2228:1623 — left: calc(80% + 103px) */
  ellipse37: { left: 967, top: 1740, width: 226.221, height: 226.221 },
  /** 2228:1626 — left: calc(10% + 12px) */
  ellipse40: { left: 120, top: 1882, size: 38, fill: "#FFDABA" },
  /** 2228:1627 — left: calc(10% + 86px) */
  ellipse41: { left: 194, top: 1869, size: 26, fill: "#CDFFBA" },
} as const;

const assets = {
  ellipse37: require("@/assets/images/order-summary/ellipse-37.png"),
  ellipse38: require("@/assets/images/order-summary/ellipse-38.png"),
  ellipse42: require("@/assets/images/order-summary/ellipse-42.png"),
};

type ScaleProps = {
  s: (v: number) => number;
  width: number;
};

/** Figma order summary — side/bottom decorative circles (2228:1622–1627). */
export function OrderSummaryBackgroundDeco({ s }: ScaleProps) {
  const { ellipse34, ellipse42, ellipse38, ellipse37, ellipse40, ellipse41 } = ELLIPSES;

  return (
    <>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: s(ellipse34.left),
          top: s(ellipse34.top),
          width: s(ellipse34.size),
          height: s(ellipse34.size),
          borderRadius: s(ellipse34.size / 2),
          backgroundColor: ellipse34.fill,
        }}
      />
      <Image
        pointerEvents="none"
        source={assets.ellipse42}
        resizeMode="contain"
        style={{
          position: "absolute",
          left: s(ellipse42.left),
          top: s(ellipse42.top),
          width: s(ellipse42.size),
          height: s(ellipse42.size),
        }}
      />
      <Image
        pointerEvents="none"
        source={assets.ellipse38}
        resizeMode="contain"
        style={{
          position: "absolute",
          left: s(ellipse38.left),
          top: s(ellipse38.top),
          width: s(ellipse38.size),
          height: s(ellipse38.size),
        }}
      />
      <Image
        pointerEvents="none"
        source={assets.ellipse37}
        resizeMode="contain"
        style={{
          position: "absolute",
          left: s(ellipse37.left),
          top: s(ellipse37.top),
          width: s(ellipse37.width),
          height: s(ellipse37.height),
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: s(ellipse40.left),
          top: s(ellipse40.top),
          width: s(ellipse40.size),
          height: s(ellipse40.size),
          borderRadius: s(ellipse40.size / 2),
          backgroundColor: ellipse40.fill,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: s(ellipse41.left),
          top: s(ellipse41.top),
          width: s(ellipse41.size),
          height: s(ellipse41.size),
          borderRadius: s(ellipse41.size / 2),
          backgroundColor: ellipse41.fill,
        }}
      />
    </>
  );
}
