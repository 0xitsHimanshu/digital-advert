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
  G,
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

/** Get Started sketch — Figma Group 2845 (437:811), Ellipse 27 / 28 */
const GET_STARTED_FRAME_W = 667;
const GET_STARTED_FRAME_H = 453;
const CTA_SKETCH_W = 609.252;
const CTA_SKETCH_H = 319.707;
const CTA_SKETCH_CX = CTA_SKETCH_W / 2;
const CTA_SKETCH_CY = CTA_SKETCH_H / 2;
const CTA_SKETCH_LEFT = (GET_STARTED_FRAME_W - CTA_SKETCH_W) / 2;
/** Ellipse 27 / 28 — identical bbox */
const CTA_OVAL_RX = 594.131 / 2;
const CTA_OVAL_RY = 139.797 / 2;

/** Figma 390:489 frame — pre-rendered gradient swirl (no SVG mask) */
const SWIRL_ARROW_COLORED = require("@/assets/images/start/swirl-arrow-colored.png");

const SWIRL_W = 342.005;
const SWIRL_H = 244.038;

/**
 * Pixel-perfect layer from your Figma export: fixed 1080×2340 coordinates,
 * scaled uniformly by width so horizontal layout matches any phone width.
 * Bottom clips on short devices (`overflow: 'hidden'`).
 *
 * Background rings Ellipse 23–26: teal `#1D6279` stroke gradient (4% → 0%
 * opacity) per Figma. Hero halo: Ellipse 35 fill `#FFFFE8`; Ellipse 36 dashed
 * border `#BA8900` / 4px. CTA swirl arrow: bundled `swirl-arrow-colored.png` at Figma 390:489 placement.
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

        {/* Swirl arrow above CTA — Figma 390:489 (same frame as mask build; raster asset) */}
        <View style={styles.swirlArrowOuter} pointerEvents="none">
          <Image
            source={SWIRL_ARROW_COLORED}
            style={styles.swirlArrowImage}
            resizeMode="contain"
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get started"
          onPress={() => router.push(AUTH_LOGIN)}
          style={styles.getStartedParent}
        >
          <View pointerEvents="none" style={[styles.groupChild, styles.groupChildLayout]}>
            <View style={styles.ctaSketchGroup2845}>
              <Svg
                width={CTA_SKETCH_W}
                height={CTA_SKETCH_H}
                viewBox={`0 0 ${CTA_SKETCH_W} ${CTA_SKETCH_H}`}
              >
                <G
                  transform={`rotate(-4.865 ${CTA_SKETCH_CX} ${CTA_SKETCH_CY})`}
                >
                  <SvgEllipse
                    cx={CTA_SKETCH_CX}
                    cy={CTA_SKETCH_CY}
                    rx={CTA_OVAL_RX}
                    ry={CTA_OVAL_RY}
                    fill="none"
                    stroke="#000000"
                    strokeOpacity={0.47}
                    strokeWidth={1.75845}
                  />
                </G>
                <G
                  transform={`rotate(3.689 ${CTA_SKETCH_CX} ${CTA_SKETCH_CY})`}
                >
                  <SvgEllipse
                    cx={CTA_SKETCH_CX}
                    cy={CTA_SKETCH_CY}
                    rx={CTA_OVAL_RX}
                    ry={CTA_OVAL_RY}
                    fill="none"
                    stroke="#000000"
                    strokeOpacity={0.47}
                    strokeWidth={1.75845}
                  />
                </G>
              </Svg>
            </View>
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
    height: GET_STARTED_FRAME_H,
    width: GET_STARTED_FRAME_W,
    position: "absolute",
  },
  /** Group 2845 — 609.252×319.707, rotate 13.482°; ellipses rotate about sketch center */
  ctaSketchGroup2845: {
    position: "absolute",
    top: 0,
    left: CTA_SKETCH_LEFT,
    width: CTA_SKETCH_W,
    height: CTA_SKETCH_H,
    transform: [{ rotate: "13.482deg" }],
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

  /** Bulb — Figma mask group: 163×163, rotate −19.306° */
  maskGroupIcon2: {
    position: "absolute",
    top: 861,
    left: 93,
    width: 163,
    height: 163,
    transform: [{ rotate: "-19.306deg" }],
  },
  /** Globe — 118×118 (Figma mask icon frame) */
  maskGroupIcon3: {
    position: "absolute",
    top: 957,
    left: 685,
    width: 118,
    height: 118,
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

  /** left: calc(50% + 81.91px), size & rotate per Figma swirl arrow layer */
  swirlArrowOuter: {
    position: "absolute",
    left: "50%",
    marginLeft: 81.91,
    top: 253.22,
    width: SWIRL_W,
    height: SWIRL_H,
    transform: [{ rotate: "10.567deg" }],
  },
  swirlArrowImage: {
    width: "100%",
    height: "100%",
  },

  getStartedParent: {
    marginLeft: -461,
    top: 407,
    left: "50%",
    width: GET_STARTED_FRAME_W,
    height: GET_STARTED_FRAME_H,
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
