import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { styles } from "@/src/screens/Auth/phone-auth-artboard";

/** Figma LOGIN 390:191 — Ellipse 27 stroke path (Group 2845 export). */
const ELLIPSE_27_PATH =
  "M263.995 87.9782C336.563 63.9125 404.531 49.0546 455.747 44.4778C481.362 42.1888 502.74 42.4762 518.394 45.4453C534.126 48.4293 543.74 54.0532 546.418 62.1272C549.095 70.2012 544.747 80.4559 533.915 92.2492C523.138 103.983 506.168 116.988 484.261 130.459C440.459 157.393 377.082 186.094 304.515 210.159C231.947 234.225 163.979 249.083 112.763 253.66C87.148 255.949 65.7698 255.661 50.1165 252.692C34.3845 249.708 24.7698 244.084 22.0922 236.01C19.4146 227.936 23.7634 217.682 34.5948 205.888C45.372 194.154 62.3421 181.149 84.2487 167.679C128.051 140.744 191.428 112.044 263.995 87.9782Z";

/** Figma LOGIN 390:192 — Ellipse 28 stroke path (Group 2845 export). */
const ELLIPSE_28_PATH =
  "M273.126 85.696C348.466 72.6911 417.887 68.1075 469.215 71.1992C494.885 72.7454 515.983 76.2092 531.02 81.4734C546.134 86.7641 554.805 93.7555 556.252 102.138C557.699 110.52 551.873 120.014 539.408 130.065C527.006 140.066 508.29 150.402 484.624 160.465C437.303 180.585 370.362 199.54 295.022 212.545C219.682 225.55 150.26 230.133 98.933 227.041C73.2627 225.495 52.165 222.031 37.1274 216.767C22.0142 211.477 13.3429 204.485 11.896 196.103C10.449 187.72 16.2747 178.226 28.7396 168.175C41.1422 158.174 59.8578 147.838 83.5242 137.776C130.845 117.656 197.786 98.7009 273.126 85.696Z";

const SKETCH_VIEW_W = 568.148;
const SKETCH_VIEW_H = 298.138;


/**
 * Header sketch ovals + tagline from Figma LOGIN (390:191, 390:192, 390:189).
 * Rendered in design-space coordinates on the 1080×2340 auth artboard.
 */
export function AuthGetStartedSketch() {
  return (
    <>
      {/* 390:192 — Ellipse 28 (upper oval) */}
      <View style={styles.authEllipse28Wrap} pointerEvents="none">
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${SKETCH_VIEW_W} ${SKETCH_VIEW_H}`}
          preserveAspectRatio="none"
        >
          <Path
            d={ELLIPSE_28_PATH}
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity={0.5}
            strokeWidth={2.5}
          />
        </Svg>
      </View>

      {/* 390:191 — Ellipse 27 (lower oval) */}
      <View style={styles.authEllipse27Wrap} pointerEvents="none">
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${SKETCH_VIEW_W} ${SKETCH_VIEW_H}`}
          preserveAspectRatio="none"
        >
          <Path
            d={ELLIPSE_27_PATH}
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity={0.5}
            strokeWidth={2.5}
          />
        </Svg>
      </View>

      {/* 390:189 — tagline */}
      <Text style={styles.authTagline}>Your Success, Our Strategy</Text>
    </>
  );
}
