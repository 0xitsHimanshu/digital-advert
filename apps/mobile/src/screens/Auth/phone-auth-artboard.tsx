import {
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
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

/** Figma 390:252 — Verify OTP Continue (same CTA geometry as login; lower on screen) */
export const OTP_CONTINUE_BTN_TOP = 1669;
export const OTP_CONTINUE_ARROW_TOP = 1707.55 - OTP_CONTINUE_BTN_TOP;

const HEADER_TOP = -23;
/** CSS bottom 68.8% on 2340px → panel height ≈752px */
const HEADER_PANEL_HEIGHT = 752;

/** Sketch ovals (390:191 / 390:192) — scaled up from Figma for tagline padding */
const AUTH_SKETCH_ELLIPSE_SCALE = 1.3;
const AUTH_SKETCH_ELLIPSE_BASE_W = 600;
const AUTH_SKETCH_ELLIPSE_BASE_H = 176.88;
const AUTH_TAGLINE_LEFT = 361;
const AUTH_TAGLINE_TOP = 545;
const AUTH_TAGLINE_W = 361;
const AUTH_TAGLINE_LINE_H = 35.21;
const AUTH_SKETCH_ELLIPSE_W = AUTH_SKETCH_ELLIPSE_BASE_W * AUTH_SKETCH_ELLIPSE_SCALE;
const AUTH_SKETCH_ELLIPSE_H = AUTH_SKETCH_ELLIPSE_BASE_H * AUTH_SKETCH_ELLIPSE_SCALE;
const AUTH_SKETCH_ELLIPSE_CX = AUTH_TAGLINE_LEFT + AUTH_TAGLINE_W / 2;
const AUTH_SKETCH_ELLIPSE_CY = AUTH_TAGLINE_TOP + AUTH_TAGLINE_LINE_H / 2;
const AUTH_SKETCH_ELLIPSE_LEFT = AUTH_SKETCH_ELLIPSE_CX - AUTH_SKETCH_ELLIPSE_W / 2;
const AUTH_SKETCH_ELLIPSE_TOP = AUTH_SKETCH_ELLIPSE_CY - AUTH_SKETCH_ELLIPSE_H / 2;

export const authAssets = {
  ellipse38: require("@/assets/images/login/ellipse38.png"),
  ellipse37: require("@/assets/images/login/ellipse37.png"),
  battery: require("@/assets/images/login/battery.png"),
  wifi: require("@/assets/images/login/wifi.png"),
  cellular: require("@/assets/images/login/cellular.png"),
  group2848: require("@/assets/images/login/group2848.png"),
  /** Figma 403:519 — alpha mask for footer doodle strip */
  otpFooterMask: require("@/assets/images/login/otp-footer-mask.png"),
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
    <Pressable
      style={styles.viewport}
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <View
        style={[
          styles.canvas,
          { transform: [{ scale }] },
          { transformOrigin: "top left" },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.creamFill} pointerEvents="none" />

        <View style={styles.ellipse38Wrap} pointerEvents="none">
          <Image source={authAssets.ellipse38} style={styles.el435} />
        </View>
        <View style={styles.ellipse37Wrap} pointerEvents="none">
          <Image source={authAssets.ellipse37} style={styles.el384} />
        </View>

        <View style={styles.tealHeader} pointerEvents="none" />

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
    </Pressable>
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
    width: 734,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 80.22,
    color: "#fff",
    textAlign: "center",
    textTransform: "capitalize",
  },
  heroSubtitle: {
    position: "absolute",
    left: "50%",
    marginLeft: -367,
    marginTop: 24,
    top: 327,
    width: 774,
    fontFamily: "Poppins_400Regular",
    fontSize: 30,
    fontWeight: "400",
    color: "#fff",
    textAlign: "center",
    textTransform: "capitalize",
  },

  /** Figma 390:192 — decorative sketch oval (upper), scaled about tagline center. */
  authEllipse28Wrap: {
    position: "absolute",
    left: AUTH_SKETCH_ELLIPSE_LEFT,
    top: AUTH_SKETCH_ELLIPSE_TOP,
    width: AUTH_SKETCH_ELLIPSE_W,
    height: AUTH_SKETCH_ELLIPSE_H,
    transform: [{ rotate: "8deg" }],
  },
  /** Figma 390:191 — decorative sketch oval (lower), scaled about tagline center. */
  authEllipse27Wrap: {
    position: "absolute",
    left: AUTH_SKETCH_ELLIPSE_LEFT,
    top: AUTH_SKETCH_ELLIPSE_TOP,
    width: AUTH_SKETCH_ELLIPSE_W,
    height: AUTH_SKETCH_ELLIPSE_H,
    transform: [{ rotate: "4.86deg" }],
  },
  /** Figma 390:189 — tagline inside sketch ovals. */
  authTagline: {
    position: "absolute",
    left: AUTH_TAGLINE_LEFT,
    top: AUTH_TAGLINE_TOP,
    width: AUTH_TAGLINE_W,
    fontFamily: "Poppins_500Medium",
    fontSize: 28.168,
    lineHeight: 35.21,
    letterSpacing: -0.8802,
    color: "#fff",
    textAlign: "center",
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

  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  phonePrefix: {
    fontFamily: "Poppins_500Medium",
    fontSize: 40.374,
    letterSpacing: -1.2617,
    color: "#1e1e1e",
    marginRight: 12,
  },
  phoneInputField: {
    flex: 1,
    fontFamily: "Poppins_500Medium",
    fontSize: 40.374,
    letterSpacing: -1.2617,
    color: "#1e1e1e",
    paddingVertical: 0,
  },

  continueBtn: {
    zIndex: 2,
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
  /** Foreground layer above the gradient — centers the Continue text and hosts the absolute arrow. */
  continueBtnForeground: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  arrowWrap: {
    position: "absolute",
    left: CONTINUE_ARROW_FRAME_LEFT,
    top: CONTINUE_ARROW_TOP,
    width: CONTINUE_ARROW_FRAME,
    height: CONTINUE_ARROW_FRAME,
    /** SVG already fills the box; explicit zIndex keeps it above the gradient on Android. */
    zIndex: 3,
  },

  footerPress: {
    position: "absolute",
    left: "50%",
    marginLeft: -288,
    top: 1369,
    maxWidth: 720
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

  /**
   * Wrapper for OTP sheet layers that shift up with the keyboard (Verify OTP).
   * Children use absolute positions on the 1080×2340 artboard.
   */
  otpSheetShift: {
    position: "absolute",
    left: 0,
    top: 0,
    width: DESIGN_W,
    height: DESIGN_H,
    zIndex: 1,
  },

  /** Figma 390:193 / 390:256 — Verify OTP */
  otpPanelShadow: {
    zIndex: 1,
    position: "absolute",
    left: "50%",
    marginLeft: -485.5,
    top: 350,
    width: 971,
    height: 1995,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  otpPanel: {
    zIndex: 1,
    position: "absolute",
    left: "50%",
    marginLeft: -540.5,
    top: 389,
    width: 1081,
    height: 2093,
    backgroundColor: "#fffdf8",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  /**
   * Figma 390:223 "Page-1" — hero bounds (percentage inset).
   * Illustration: `src/screens/VerifyOtp/components/otp-page1-illustration.tsx` (477×500 viewBox SVG).
   */
  otpPage1Wrap: {
    position: "absolute",
    top: "22.44%",
    left: "27.69%",
    width: "44.02%",
    height: "21.32%",
    zIndex: 2,
  },
  otpPage1Svg: {
    width: "100%",
    height: "100%",
  },
  /**
   * Figma 403:521 — masked footer doodle strip.
   * Compositing (matches Figma `mask-alpha` group):
   *   • Rectangle 1052 = 1164.202 × 384 at (-40.43, 2030), fill `rgba(17,17,17,0.08)`
   *   • Mask = artwork PNG positioned at (29.428, 0), size 1102.475 × 384
   * Source PNG is 2205 × 768 (aspect 89:31) — exactly the visible aspect, so a
   * uniform `cover` scale shows every doodle without cropping or vertical stretch.
   */
  otpFooterMaskOuter: {
    position: "absolute",
    left: -40.43,
    top: 2030,
    width: 1164.202,
    height: 384,
  },
  otpFooterMaskedView: {
    width: 1164.202,
    height: 384,
  },
  otpFooterMaskCanvas: {
    width: 1164.202,
    height: 384,
    backgroundColor: "transparent",
  },
  /** mask-size 1102.475 × 384 at mask-position (29.428, 0) */
  otpFooterArtworkImage: {
    position: "absolute",
    left: 29.428,
    top: 0,
    width: 1102.475,
    height: 384,
  },
  otpFooterMaskFill: {
    width: 1164.202,
    height: 384,
    backgroundColor: "rgba(17,17,17,0.08)",
  },
  otpTitle: {
    position: "absolute",
    zIndex: 2,
    left: 71,
    top: 1155,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 49.914,
    lineHeight: 49.914,
    letterSpacing: -1.2478,
    color: "#1e1e1e",
    textTransform: "capitalize",
  },
  otpInstruction: {
    position: "absolute",
    zIndex: 2,
    left: 71,
    top: 1250,
    width: 763,
    fontFamily: "Poppins_400Regular",
    fontSize: 39.931,
    lineHeight: 49.914,
    letterSpacing: -1.2478,
    color: "#989898",
  },
  otpInstructionStrong: {
    fontFamily: "Poppins_600SemiBold",
    color: "#545454",
  },
  /** Figma 390:256 — 5× cells, row top 1462 */
  otpRow: {
    position: "absolute",
    zIndex: 2,
    left: (DESIGN_W - 938.79) / 2,
    top: 1462,
    width: 938.79,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  otpCell: {
    width: 139.758,
    height: 139.758,
    borderRadius: 29.948,
    borderWidth: 4.991,
    backgroundColor: "#fffdf8",
    alignItems: "center",
    justifyContent: "center",
  },
  otpCellEmpty: {
    borderColor: "#e1e1e1",
  },
  otpCellFilled: {
    borderColor: "#165d75",
  },
  otpDigit: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 44.922,
    lineHeight: 49.914,
    letterSpacing: -1.2478,
    color: "#545454",
    paddingVertical: 0,
    textAlign: "center",
    width: 120,
  },
  otpResendRow: {
    zIndex: 2,
    position: "absolute",
    left: 0,
    top: 1856.6,
    width: DESIGN_W,
    alignItems: "center",
  },
  otpResendText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 39.931,
    lineHeight: 49.914,
    letterSpacing: -1.2478,
    textAlign: "center",
  },
  otpResendTimer: {
    color: "#989898",
  },
  otpResendLink: {
    color: "#648ddb",
    textDecorationLine: "underline",
  },
});
