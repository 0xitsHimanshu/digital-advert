import { Image, View } from "react-native";

const ellipse34 = require("@/assets/images/login/ellipse34.png");
const ellipse37 = require("@/assets/images/login/ellipse37.png");
const ellipse38 = require("@/assets/images/login/ellipse38.png");
const ellipse40 = require("@/assets/images/login/ellipse40.png");
const ellipse41 = require("@/assets/images/login/ellipse41.png");

type ProfileBottomDecoProps = {
  s: (v: number) => number;
  width: number;
};

/** Figma profile page bottom decorative circles (2245:532–537). */
export function ProfileBottomDeco({ s, width }: ProfileBottomDecoProps) {
  return (
    <>
      <Image
        pointerEvents="none"
        source={ellipse34}
        style={{
          position: "absolute",
          left: -s(154),
          top: s(1620),
          width: s(291),
          height: s(291),
          opacity: 0.35,
        }}
      />
      <Image
        pointerEvents="none"
        source={ellipse37}
        style={{
          position: "absolute",
          left: width * 0.8 + s(103),
          top: s(1740),
          width: s(226),
          height: s(226),
          opacity: 0.5,
        }}
      />
      <Image
        pointerEvents="none"
        source={ellipse38}
        style={{
          position: "absolute",
          left: width * 0.8 + s(84),
          top: s(1721),
          width: s(264),
          height: s(264),
          opacity: 0.4,
        }}
      />
      <Image
        pointerEvents="none"
        source={ellipse40}
        style={{
          position: "absolute",
          left: width * 0.1 + s(12.5),
          top: s(1882),
          width: s(38),
          height: s(38),
          opacity: 0.6,
        }}
      />
      <Image
        pointerEvents="none"
        source={ellipse41}
        style={{
          position: "absolute",
          left: width * 0.1 + s(86.5),
          top: s(1869),
          width: s(26),
          height: s(26),
          opacity: 0.6,
        }}
      />
    </>
  );
}
