import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse as SvgEllipse,
  LinearGradient as SvgLinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import type { ReactNode } from "react";

/** Figma LOGIN-style frame — 1080×2340 artboard */
export const DESIGN_W = 1080;
export const DESIGN_H = 2340;

/** Continue CTA / arrow — Figma y alignment inside LOGIN frame */
export const CONTINUE_BTN_TOP = 1182;
export const CONTINUE_ARROW_TOP = 1220.55 - CONTINUE_BTN_TOP;
/** Figma 390:176 / 390:175 — primary button */
export const CONTINUE_BTN_W = 930.224;
export const CONTINUE_BTN_H = 146.138;
export const CONTINUE_BTN_LEFT = (DESIGN_W - CONTINUE_BTN_W) / 2;
/** Figma: `left-[calc(80%+17px)]` on artboard, relative to button frame */
export const CONTINUE_ARROW_FRAME_LEFT = DESIGN_W * 0.8 + 17 - CONTINUE_BTN_LEFT;
/** Figma 390:178 outer frame */
export const CONTINUE_ARROW_FRAME = 67.448;

const HEADER_TOP = -23;
/** CSS bottom 68.8% on 2340px → panel height ≈752px */
const HEADER_PANEL_HEIGHT = 752;

export const authAssets = {
  ellipse38: require("@/assets/images/login/ellipse38.png"),
  ellipse37: require("@/assets/images/login/ellipse37.png"),
  battery: require("@/assets/images/login/battery.png"),
  wifi: require("@/assets/images/login/wifi.png"),
  cellular: require("@/assets/images/login/cellular.png"),
  continueArrow390178: require("@/assets/images/login/continue-arrow-390-178.png"),
  group2848: require("@/assets/images/login/group2848.png"),
  group2845: require("@/assets/images/login/group2845.png"),
} as const;

function LoginHeaderRing24() {
  return (
    <Svg width={1340} height={1340} viewBox="0 0 1412 1412">
      <Defs>
        <SvgLinearGradient
          id="loginRing24"
          x1={706}
          y1={0}
          x2={706}
          y2={1351.5}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" stopOpacity={0.03} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </SvgLinearGradient>
      </Defs>
      <Circle
        cx={706}
        cy={706}
        r={641}
        fill="none"
        stroke="url(#loginRing24)"
        strokeWidth={130}
      />
    </Svg>
  );
}

function LoginHeaderRing25() {
  return (
    <Svg width={861} height={862} viewBox="0 0 1033 1032">
      <Defs>
        <SvgLinearGradient
          id="loginRing25"
          x1={516.5}
          y1={0}
          x2={516.5}
          y2={987.782}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" stopOpacity={0.03} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M516.5 65C765.916 65 968 266.979 968 516C968 765.021 765.916 967 516.5 967C267.084 967 65 765.021 65 516C65 266.979 267.084 65 516.5 65Z"
        fill="none"
        stroke="url(#loginRing25)"
        strokeWidth={130}
      />
    </Svg>
  );
}

function LoginHeaderRing39() {
  return (
    <Svg width={369} height={368} viewBox="0 0 663 664">
      <Defs>
        <SvgLinearGradient
          id="loginRing39"
          x1={331.5}
          y1={0}
          x2={331.5}
          y2={635.55}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" stopOpacity={0.03} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M331.5 65C478.592 65 598 184.448 598 332C598 479.552 478.592 599 331.5 599C184.408 599 65 479.552 65 332C65 184.448 184.408 65 331.5 65Z"
        fill="none"
        stroke="url(#loginRing39)"
        strokeWidth={130}
      />
    </Svg>
  );
}

function Ellipse34Mint() {
  return (
    <Svg width={398} height={398} viewBox="0 0 398 398">
      <Defs>
        <SvgLinearGradient
          id="loginMint34"
          x1={0}
          y1={0}
          x2={398}
          y2={398}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#DCF5EA" />
          <Stop offset="1" stopColor="#C8EBDD" />
        </SvgLinearGradient>
        <ClipPath id="mintSemiClip">
          <Rect x={199} y={0} width={199} height={398} />
        </ClipPath>
      </Defs>
      <Circle
        cx={199}
        cy={199}
        r={199}
        fill="url(#loginMint34)"
        clipPath="url(#mintSemiClip)"
      />
    </Svg>
  );
}

function Ellipse42DashedRing() {
  return (
    <Svg width={352} height={352} viewBox="0 0 352 352">
      <SvgEllipse
        cx={176}
        cy={176}
        rx={172}
        ry={172}
        fill="none"
        stroke="#95C9AF"
        strokeWidth={4}
        strokeDasharray={[14, 12]}
      />
    </Svg>
  );
}

function Ellipse40Decoration() {
  return (
    <Svg width={38} height={38} viewBox="0 0 38 38">
      <Circle cx={19} cy={19} r={17} fill="#FFE5D6" />
      <Circle cx={19} cy={19} r={15} fill="#FFDCC8" opacity={0.85} />
    </Svg>
  );
}

function Ellipse41Decoration() {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26">
      <Defs>
        <RadialGradient
          id="loginEllipse41Radial"
          cx={13}
          cy={13}
          r={13}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#D4FFC9" stopOpacity={0.85} />
          <Stop offset="0.55" stopColor="#DCFFD2" stopOpacity={0.35} />
          <Stop offset="1" stopColor="#E8FFE8" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={13} cy={13} r={13} fill="url(#loginEllipse41Radial)" />
    </Svg>
  );
}

const { width: SCREEN_W } = Dimensions.get("window");

type PhoneAuthArtboardProps = {
  /** Hero copy, form, CTAs — rendered above bottom decorations */
  children: ReactNode;
};

export function PhoneAuthArtboard({ children }: PhoneAuthArtboardProps) {
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
        <View style={styles.creamFill} />

        <View style={styles.ellipse38Wrap} pointerEvents="none">
          <Image source={authAssets.ellipse38} style={styles.el435} />
        </View>
        <View style={styles.ellipse37Wrap} pointerEvents="none">
          <Image source={authAssets.ellipse37} style={styles.el384} />
        </View>

        <View style={styles.tealHeader} />

        <View style={styles.ellipse24Wrap} pointerEvents="none">
          <LoginHeaderRing24 />
        </View>
        <View style={styles.ellipse25Wrap} pointerEvents="none">
          <LoginHeaderRing25 />
        </View>
        <View style={styles.ellipse39Wrap} pointerEvents="none">
          <LoginHeaderRing39 />
        </View>

        {children}

        <View style={styles.ellipse34Wrap} pointerEvents="none">
          <Ellipse34Mint />
        </View>
        <View style={styles.ellipse42Wrap} pointerEvents="none">
          <Ellipse42DashedRing />
        </View>

        <View style={styles.group2848Outer} pointerEvents="none">
          <View style={styles.group2848Inner}>
            <Image source={authAssets.group2848} style={styles.group2848Img} />
          </View>
        </View>

        <View style={styles.dot40Wrap} pointerEvents="none">
          <Ellipse40Decoration />
        </View>
        <View style={styles.dot41Wrap} pointerEvents="none">
          <Ellipse41Decoration />
        </View>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    backgroundColor: "#fffdf8",
    overflow: "hidden",
  },
  canvas: {
    width: DESIGN_W,
    height: DESIGN_H,
    backgroundColor: "#fffdf8",
    overflow: "hidden",
  },
  creamFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fffdf8",
  },

  ellipse38Wrap: {
    position: "absolute",
    left: 863,
    top: 2005,
    width: 435,
    height: 435,
  },
  el435: { width: 435, height: 435 },
  ellipse37Wrap: {
    position: "absolute",
    left: 888,
    top: 2030,
    width: 384,
    height: 384,
  },
  el384: { width: 384, height: 384 },

  tealHeader: {
    position: "absolute",
    left: 0,
    top: HEADER_TOP,
    width: DESIGN_W,
    height: HEADER_PANEL_HEIGHT,
    backgroundColor: "#165d75",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },

  ellipse24Wrap: {
    position: "absolute",
    left: -131,
    top: 79,
    width: 1340,
    height: 1340,
  },
  ellipse25Wrap: {
    position: "absolute",
    left: 110,
    top: 318,
    width: 861,
    height: 862,
  },
  ellipse39Wrap: {
    position: "absolute",
    left: 355,
    top: 539,
    width: 369,
    height: 368,
  },
  statusBarRow: {
    position: "absolute",
    left: 0,
    top: 33,
    width: DESIGN_W,
    height: 96,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 62,
  },
  statusTime: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 44,
    color: "#fff",
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: { width: 38, height: 24, resizeMode: "contain", marginRight: 10 },
  statusIconWifi: {
    width: 34,
    height: 24,
    resizeMode: "contain",
    marginRight: 10,
  },
  statusBattery: { width: 44, height: 22, resizeMode: "contain" },

  heroTitle: {
    position: "absolute",
    left: 198,
    top: 229,
    width: 683,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 80.217,
    lineHeight: 76.483,
    color: "#fff",
    textTransform: "capitalize",
  },
  heroSubtitle: {
    position: "absolute",
    left: "50%",
    marginLeft: -367,
    top: 327,
    width: 734,
    fontFamily: "Poppins_400Regular",
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
    textTransform: "capitalize",
  },

  getStartedSketchOuter: {
    position: "absolute",
    left: 229,
    top: 330,
    width: 622,
    height: 422.382,
    alignItems: "center",
    justifyContent: "center",
  },
  getStartedSketchInner: {
    transform: [{ rotate: "13.48deg" }],
  },
  group2845Img: {
    width: 568.148,
    height: 298.138,
    resizeMode: "contain",
  },
  getStartedLabel: {
    position: "absolute",
    left: 441.48,
    top: 517.92,
    fontFamily: "Poppins_500Medium",
    fontSize: 36.302,
    lineHeight: 45.378,
    letterSpacing: -1.1344,
    color: "#fff",
  },

  fieldLabel: {
    position: "absolute",
    left: 63.08,
    top: 866,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 40.374,
    lineHeight: 50.467,
    letterSpacing: -1.2617,
    color: "#1e1e1e",
  },
  umber: { textTransform: "lowercase" },

  inputShell: {
    position: "absolute",
    left: (DESIGN_W - 954) / 2,
    top: 934,
    width: 954,
    height: 141.308,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: "#e1e1e1",
    backgroundColor: "#fffdf8",
    justifyContent: "center",
    paddingHorizontal: 36,
  },
  input: {
    fontFamily: "Poppins_500Medium",
    fontSize: 40.374,
    letterSpacing: -1.2617,
    color: "#1e1e1e",
    paddingVertical: 0,
  },

  continueBtn: {
    position: "absolute",
    left: CONTINUE_BTN_LEFT,
    top: CONTINUE_BTN_TOP,
    width: CONTINUE_BTN_W,
    height: CONTINUE_BTN_H,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 39,
    overflow: "hidden",
  },
  continueGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 39,
  },
  continueText: {
    fontFamily: "LexendDeca_600SemiBold",
    fontSize: 40,
    lineHeight: 49,
    letterSpacing: -1.26,
    color: "#fff",
    textAlign: "center",
  },
  arrowWrap: {
    position: "absolute",
    left: CONTINUE_ARROW_FRAME_LEFT,
    top: CONTINUE_ARROW_TOP,
    width: CONTINUE_ARROW_FRAME,
    height: CONTINUE_ARROW_FRAME,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowRotate180Outer: {
    width: CONTINUE_ARROW_FRAME,
    height: CONTINUE_ARROW_FRAME,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "180deg" }],
  },
  arrowNode178Frame: {
    width: CONTINUE_ARROW_FRAME,
    height: CONTINUE_ARROW_FRAME,
    position: "relative",
  },
  arrowGlyphAbsolute: {
    position: "absolute",
    top: "25%",
    bottom: "25%",
    left: "12.5%",
    right: "12.5%",
    opacity: 1,
  },

  footerPress: {
    position: "absolute",
    left: "50%",
    marginLeft: -288,
    top: 1369,
    maxWidth: 620,
  },
  footerGrey: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 40.374,
    lineHeight: 50.467,
    letterSpacing: -1.2617,
    color: "#8e8e8e",
  },
  footerBold: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 40.374,
    lineHeight: 50.467,
    letterSpacing: -1.2617,
    color: "#000",
  },

  ellipse34Wrap: {
    position: "absolute",
    left: -200,
    top: 1421,
    width: 398,
    height: 398,
  },
  ellipse42Wrap: {
    position: "absolute",
    left: -177,
    top: 1444,
    width: 352,
    height: 352,
  },

  group2848Outer: {
    position: "absolute",
    left: -285,
    top: 1848,
    width: 673.016,
    height: 419.075,
    alignItems: "center",
    justifyContent: "center",
  },
  group2848Inner: {
    transform: [{ rotate: "-8.28deg" }],
    width: 631.868,
    height: 331.575,
  },
  group2848Img: {
    width: 631.868,
    height: 331.575,
    resizeMode: "contain",
  },

  dot40Wrap: {
    position: "absolute",
    left: 198,
    top: 1781,
    width: 38,
    height: 38,
  },
  dot41Wrap: {
    position: "absolute",
    left: 272,
    top: 1768,
    width: 26,
    height: 26,
  },
});
