import { useRouter, type Href } from "expo-router";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse as SvgEllipse,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import { colors } from "@/constants/theme";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/** Figma START artboard — matches exported “START” frame */
const DESIGN_W = 1080;
const DESIGN_H = 2340;

const AUTH_LOGIN = "/(auth)/login" as Href;

/**
 * Pixel-perfect layer from your Figma export: fixed 1080×2340 coordinates,
 * scaled uniformly by width so horizontal layout matches any phone width.
 * Bottom clips on short devices (`overflow: 'hidden'`).
 *
 * Background rings Ellipse 23–26: teal `#1D6279` stroke gradient (4% → 0%
 * opacity) per Figma. Hero halo: Ellipse 35 fill `#FFFFE8`; Ellipse 36 dashed
 * border `#BA8900` / 4px. Arrow: Figma union path filled with accent.
 */
export default function StartScreen() {
  const router = useRouter();
  const scale = SCREEN_W / DESIGN_W;

  return (
    <View style={styles.viewport}>
      <View
          style={[
          styles.canvas,
          { transform: [{ scale }] },
          { transformOrigin: "top left" },
        ]}
      >
        {/* Ellipse 23–26 — layered teal gradient rings (Figma node 390:468…) */}
        <View style={styles.ellipse23Wrap} pointerEvents="none">
          <Svg width={1412} height={1412} viewBox="0 0 1412 1412">
            <Defs>
              <SvgLinearGradient
                id="e23"
                x1={706}
                y1={0}
                x2={706}
                y2={1351.5}
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="#1D6279" stopOpacity={0.04} />
                <Stop offset="1" stopColor="#1D6279" stopOpacity={0} />
              </SvgLinearGradient>
            </Defs>
            <Circle
              cx={706}
              cy={706}
              r={641}
              fill="none"
              stroke="url(#e23)"
              strokeWidth={130}
            />
          </Svg>
        </View>
        <View style={styles.ellipse24Wrap} pointerEvents="none">
          <Svg width={1033} height={1032} viewBox="0 0 1033 1032">
            <Defs>
              <SvgLinearGradient
                id="e24"
                x1={516.5}
                y1={0}
                x2={516.5}
                y2={987.782}
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="#1D6279" stopOpacity={0.04} />
                <Stop offset="1" stopColor="#1D6279" stopOpacity={0} />
              </SvgLinearGradient>
            </Defs>
            <Path
              d="M516.5 65C765.916 65 968 266.979 968 516C968 765.021 765.916 967 516.5 967C267.084 967 65 765.021 65 516C65 266.979 267.084 65 516.5 65Z"
              fill="none"
              stroke="url(#e24)"
              strokeWidth={130}
            />
          </Svg>
        </View>
        <View style={styles.ellipse25Wrap} pointerEvents="none">
          <Svg width={663} height={664} viewBox="0 0 663 664">
            <Defs>
              <SvgLinearGradient
                id="e25"
                x1={331.5}
                y1={0}
                x2={331.5}
                y2={635.55}
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="#1D6279" stopOpacity={0.04} />
                <Stop offset="1" stopColor="#1D6279" stopOpacity={0} />
              </SvgLinearGradient>
            </Defs>
            <Path
              d="M331.5 65C478.592 65 598 184.448 598 332C598 479.552 478.592 599 331.5 599C184.408 599 65 479.552 65 332C65 184.448 184.408 65 331.5 65Z"
              fill="none"
              stroke="url(#e25)"
              strokeWidth={130}
            />
          </Svg>
        </View>
        <View style={styles.ellipse26Wrap} pointerEvents="none">
          <Svg width={240} height={240} viewBox="0 0 240 240">
            <Defs>
              <SvgLinearGradient
                id="e26"
                x1={120}
                y1={0}
                x2={120}
                y2={229.717}
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="#1D6279" stopOpacity={0.04} />
                <Stop offset="1" stopColor="#1D6279" stopOpacity={0} />
              </SvgLinearGradient>
            </Defs>
            <Circle
              cx={120}
              cy={120}
              r={65}
              fill="none"
              stroke="url(#e26)"
              strokeWidth={110}
            />
          </Svg>
        </View>


        <Text style={[styles.findTheBest, styles.getStartedTypo]}>
          find the best service here
        </Text>

        <Text style={[styles.findTheBest2, styles.textFlexBox]}>
          {
            "find the best servics herefind the best servics here find the best "
          }
        </Text>

        {/* Ellipse 35 — cream fill behind hero (Figma) */}
        <View style={styles.ellipse35Wrap} pointerEvents="none">
          <Svg width={1013} height={1013} viewBox="0 0 1013 1013">
            <Circle cx={506.5} cy={506.5} r={506.5} fill="#FFFFE8" />
          </Svg>
        </View>
        {/* Ellipse 36 — dashed gold ring */}
        <View style={styles.ellipse36Wrap} pointerEvents="none">
          <Svg width={951} height={952} viewBox="0 0 951 952">
            <SvgEllipse
              cx={951 / 2}
              cy={952 / 2}
              rx={951 / 2 - 2}
              ry={952 / 2 - 2}
              fill="none"
              stroke="#BA8900"
              strokeWidth={4}
              strokeDasharray={[14, 12]}
            />
          </Svg>
        </View>

        <Image
          source={require("@/assets/images/start/hero.png")}
          style={styles.happyTeenagerShowingPositivIcon}
          resizeMode="cover"
        />

        {/* Bottom wave — SVG matches Figma vector + gradient */}
        <View style={styles.waveWrap}>
          <Svg
            width={1078}
            height={151.5}
            viewBox="0 0 1078 151.5"
            preserveAspectRatio="none"
          >
            <Defs>
              <SvgLinearGradient
                id="startWaveGrad"
                x1="0"
                y1="75.75"
                x2="1078"
                y2="75.75"
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="0" stopColor="#165D75" />
                <Stop offset="1" stopColor="#177EA1" />
              </SvgLinearGradient>
            </Defs>
            <Path
              d="M1078 0C735.2 100.4 216.5 41.8333 0 0V151.5H1078V0Z"
              fill="url(#startWaveGrad)"
            />
          </Svg>
        </View>

        {/* Floating white squares */}
        <View style={[styles.rectangleView, styles.startChildLayout]} />
        <View style={[styles.startChild4, styles.startChildLayout]} />
        <View style={[styles.startChild5, styles.startChildLayout]} />
        <View style={[styles.startChild6, styles.startChildLayout]} />

        <Image
          source={require("@/assets/images/start/lightbulb-mask.png")}
          style={[styles.maskGroupIcon2, { tintColor: ACCENT }]}
          resizeMode="contain"
        />
        <Image
          source={require("@/assets/images/start/globe-mask.png")}
          style={[styles.maskGroupIcon3, { tintColor: ACCENT }]}
          resizeMode="contain"
        />

        <Image
          source={require("@/assets/images/start/card-megaphone.png")}
          style={styles.chatgptImageMay4202612}
          resizeMode="contain"
        />
        <Image
          source={require("@/assets/images/start/card-heart.png")}
          style={styles.chatgptImageMay4202601}
          resizeMode="contain"
        />

        {/* Twisted / rounded-head arrow — Figma Union (Bold / Arrows / Arrow Left Up) */}
        <View style={styles.boldArrowsArrowLeftUp}>
          <Svg width={67} height={67} viewBox="0 0 26.7029 26.7029">
            <Path
              d="M26.2684 24.1705C26.8478 24.7498 26.8478 25.6891 26.2684 26.2684C25.6891 26.8478 24.7498 26.8478 24.1705 26.2684L10.3845 12.4825L2.53249 20.3344C2.10821 20.7587 1.47013 20.8856 0.915787 20.656C0.361442 20.4264 0 19.8855 0 19.2855V1.4835C0 0.664187 0.664184 1.88636e-06 1.4835 1.88636e-06L19.2855 0C19.8855 0 20.4264 0.361442 20.656 0.915786C20.8856 1.47013 20.7587 2.10821 20.3344 2.53249L12.4825 10.3845L26.2684 24.1705Z"
              fill={ACCENT}
            />
          </Svg>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get started"
          onPress={() => router.push(AUTH_LOGIN)}
          style={styles.getStartedParent}
        >
          <View pointerEvents="none" style={[styles.groupChild, styles.groupChildLayout]}>
            <Svg
              width={667}
              height={453}
              viewBox="0 0 609.252 319.707"
              preserveAspectRatio="xMidYMid meet"
            >
              <Path
                d="M283.095 94.3425C360.912 68.5357 433.798 52.604 488.72 47.6961C516.188 45.2415 539.113 45.5487 555.898 48.7326C572.769 51.9325 583.078 57.9639 585.95 66.622C588.821 75.2802 584.158 86.277 572.543 98.9235C560.986 111.507 542.788 125.452 519.296 139.897C472.326 168.78 404.363 199.558 326.546 225.365C248.728 251.171 175.843 267.103 120.921 272.011C93.4529 274.465 70.5279 274.158 53.7421 270.974C36.8719 267.775 26.5612 261.743 23.6898 253.085C20.8185 244.427 25.4822 233.43 37.0972 220.784C48.6541 208.2 66.8526 194.255 90.344 179.81C137.315 150.927 205.277 120.149 283.095 94.3425Z"
                fill="none"
                stroke="#000000"
                strokeOpacity={0.47}
                strokeWidth={1.75845}
              />
              <Path
                d="M292.886 91.895C373.676 77.9492 448.121 73.0353 503.162 76.3506C530.689 78.0087 553.313 81.7221 569.439 87.3672C585.646 93.0406 594.944 100.538 596.495 109.527C598.047 118.516 591.8 128.697 578.434 139.475C565.134 150.2 545.064 161.283 519.685 172.074C468.941 193.649 397.157 213.977 316.366 227.922C235.576 241.868 161.131 246.782 106.091 243.467C78.5632 241.809 55.9389 238.095 39.8133 232.45C23.6067 226.777 14.3077 219.279 12.756 210.29C11.2044 201.301 17.4518 191.12 30.8186 180.342C44.1185 169.618 64.1886 158.534 89.5673 147.744C140.312 126.168 212.096 105.841 292.886 91.895Z"
                fill="none"
                stroke="#000000"
                strokeOpacity={0.47}
                strokeWidth={1.75845}
              />
            </Svg>
          </View>
          <Text style={[styles.getStarted, styles.getStartedTypo]}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const ACCENT = colors.startAccent;

const CARD_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 7, height: 7 },
  shadowOpacity: 0.1,
  shadowRadius: 8.5,
  elevation: 17,
} as const;

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    backgroundColor: "#fffdf8",
    overflow: "hidden",
    maxHeight: SCREEN_H,
  },
  canvas: {
    width: DESIGN_W,
    height: DESIGN_H,
    backgroundColor: "#fffdf8",
    overflow: "hidden",
  },

  textFlexBox: {
    textAlign: "left",
    position: "absolute",
  },
  getStartedTypo: {
    fontWeight: "500",
    textAlign: "left",
    color: "#000",
    left: "50%",
    position: "absolute",
  },

  startChildLayout: {
    height: 138,
    width: 138,
    backgroundColor: "#fff",
    borderRadius: 29,
    position: "absolute",
    ...CARD_SHADOW,
  },

  groupChildLayout: {
    height: 453,
    width: 667,
    position: "absolute",
  },

  ellipse23Wrap: {
    position: "absolute",
    top: -50,
    left: -111,
    width: 1412,
    height: 1412,
  },
  ellipse24Wrap: {
    position: "absolute",
    top: 140,
    left: 79,
    width: 1033,
    height: 1032,
  },
  ellipse25Wrap: {
    position: "absolute",
    top: 324,
    left: 265,
    width: 663,
    height: 664,
  },
  ellipse26Wrap: {
    position: "absolute",
    top: 536,
    left: 476,
    width: 240,
    height: 240,
  },

  light1: {
    marginLeft: -549,
    top: -3,
    width: 1098,
    height: 129,
    left: "50%",
    position: "absolute",
    overflow: "hidden",
  },
  barsStatusBarIphoneL: {
    height: "39.6%",
    width: "88.11%",
    top: "29.61%",
    right: "6.33%",
    bottom: "30.8%",
    left: "5.56%",
    position: "absolute",
  },
  barsStatusBarIphoneX: {
    width: "8.79%",
    right: "91.21%",
    bottom: "0%",
    left: "0%",
    top: "0%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
  },
  statusTime: {
    fontSize: 44,
    fontFamily: "Poppins_400Regular",
    color: "#000",
    textAlign: "left",
  },

  findTheBest: {
    marginLeft: -424,
    top: 207,
    fontSize: 87,
    lineHeight: 83,
    fontFamily: "LexendDeca_500Medium",
    width: 593,
    textTransform: "capitalize",
  },
  findTheBest2: {
    marginLeft: -416,
    top: 397,
    fontSize: 30,
    fontFamily: "Poppins_400Regular",
    color: "#a4a4a4",
    width: 571,
    textTransform: "capitalize",
    left: "50%",
  },

  ellipse35Wrap: {
    marginLeft: -501,
    top: 1570,
    width: 1013,
    height: 1013,
    left: "50%",
    position: "absolute",
  },
  ellipse36Wrap: {
    marginLeft: -469,
    top: 1599,
    width: 951,
    height: 952,
    left: "50%",
    position: "absolute",
  },

  happyTeenagerShowingPositivIcon: {
    top: 1040,
    left: -304,
    width: 1546,
    height: 1910,
    position: "absolute",
  },

  waveWrap: {
    position: "absolute",
    left: 2,
    top: 2190,
    width: 1078,
    height: 151.5,
  },

  rectangleView: {
    top: 1942,
    left: 21,
    transform: [{ rotate: "-14.1deg" }],
  },
  startChild4: {
    top: 1449,
    left: 59,
    transform: [{ rotate: "-35.4deg" }],
  },
  startChild5: {
    top: 1285,
    left: 799,
    transform: [{ rotate: "16.8deg" }],
  },
  startChild6: {
    top: 1699,
    left: 878,
    transform: [{ rotate: "6.5deg" }],
  },

  maskGroupIcon2: {
    top: 867,
    left: 124,
    width: 208,
    height: 208,
    position: "absolute",
  },
  maskGroupIcon3: {
    top: 957,
    left: 709,
    width: 118,
    height: 118,
    position: "absolute",
  },

  chatgptImageMay4202612: {
    top: 1282,
    left: 762,
    width: 166,
    height: 166,
    position: "absolute",
  },
  chatgptImageMay4202601: {
    top: 1343,
    left: -5,
    width: 302,
    height: 247,
    position: "absolute",
  },

  boldArrowsArrowLeftUp: {
    top: 538,
    left: 154,
    width: 67,
    height: 67,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "134.41deg" }],
  },

  getStartedParent: {
    marginLeft: -461,
    top: 407,
    left: "50%",
    width: 667,
    height: 453,
    position: "absolute",
  },
  getStarted: {
    marginLeft: -106,
    top: 202,
    fontSize: 39,
    letterSpacing: -1.22,
    lineHeight: 49,
    fontFamily: "Poppins_500Medium",
  },
  groupChild: {
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
