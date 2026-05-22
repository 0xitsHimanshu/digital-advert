import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import Svg, { Circle, Defs, Path, Stop, LinearGradient as SvgLinearGradient } from "react-native-svg";

type CartBackgroundProps = {
  s: (v: number) => number;
  width: number;
};

/** Figma MY CART — gradient fill + concentric teal rings (2243:290–293). */
export function CartBackground({ s, width }: CartBackgroundProps) {
  const e23 = s(1412);
  const e24W = s(1033);
  const e24H = s(1032);
  const e25W = s(663);
  const e25H = s(664);
  const e26 = s(240);

  return (
    <>
      <LinearGradient
        colors={["#fffef9", "#ffffff"]}
        locations={[0.01574, 1]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        pointerEvents="none"
      />

      {/* Ellipse 23 — outermost (1412×1412) */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: -s(165),
          top: s(9),
          width: e23,
          height: e23,
        }}
      >
        <Svg width={e23} height={e23} viewBox="0 0 1412 1412">
          <Defs>
            <SvgLinearGradient
              id="cartE23"
              x1={706}
              y1={0}
              x2={706}
              y2={1351.5}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor="#1D6279" stopOpacity={0.03} />
              <Stop offset="1" stopColor="#1D6279" stopOpacity={0} />
            </SvgLinearGradient>
          </Defs>
          <Circle
            cx={706}
            cy={706}
            r={641}
            fill="none"
            stroke="url(#cartE23)"
            strokeWidth={130}
          />
        </Svg>
      </View>

      {/* Ellipse 24 — 1033×1032 */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: (width - e24W) / 2,
          top: s(199),
          width: e24W,
          height: e24H,
        }}
      >
        <Svg width={e24W} height={e24H} viewBox="0 0 1033 1032">
          <Defs>
            <SvgLinearGradient
              id="cartE24"
              x1={516.5}
              y1={0}
              x2={516.5}
              y2={987.782}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor="#1D6279" stopOpacity={0.03} />
              <Stop offset="1" stopColor="#1D6279" stopOpacity={0} />
            </SvgLinearGradient>
          </Defs>
          <Path
            d="M516.5 65C765.916 65 968 266.979 968 516C968 765.021 765.916 967 516.5 967C267.084 967 65 765.021 65 516C65 266.979 267.084 65 516.5 65Z"
            fill="none"
            stroke="url(#cartE24)"
            strokeWidth={130}
          />
        </Svg>
      </View>

      {/* Ellipse 25 — 663×664 */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: (width - e25W) / 2,
          top: s(383),
          width: e25W,
          height: e25H,
        }}
      >
        <Svg width={e25W} height={e25H} viewBox="0 0 663 664">
          <Defs>
            <SvgLinearGradient
              id="cartE25"
              x1={331.5}
              y1={0}
              x2={331.5}
              y2={635.55}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor="#1D6279" stopOpacity={0.03} />
              <Stop offset="1" stopColor="#1D6279" stopOpacity={0} />
            </SvgLinearGradient>
          </Defs>
          <Path
            d="M331.5 65C478.592 65 598 184.448 598 332C598 479.552 478.592 599 331.5 599C184.408 599 65 479.552 65 332C65 184.448 184.408 65 331.5 65Z"
            fill="none"
            stroke="url(#cartE25)"
            strokeWidth={130}
          />
        </Svg>
      </View>

      {/* Ellipse 26 — 240×240 */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: width * 0.4 - s(10),
          top: s(595),
          width: e26,
          height: e26,
        }}
      >
        <Svg width={e26} height={e26} viewBox="0 0 240 240">
          <Defs>
            <SvgLinearGradient
              id="cartE26"
              x1={120}
              y1={0}
              x2={120}
              y2={229.717}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor="#1D6279" stopOpacity={0.03} />
              <Stop offset="1" stopColor="#1D6279" stopOpacity={0} />
            </SvgLinearGradient>
          </Defs>
          <Circle
            cx={120}
            cy={120}
            r={65}
            fill="none"
            stroke="url(#cartE26)"
            strokeWidth={110}
          />
        </Svg>
      </View>
    </>
  );
}
