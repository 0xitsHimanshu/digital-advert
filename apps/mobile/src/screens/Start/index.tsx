/**
 * StartScreen — onboarding / landing screen (app entry via `src/app/index.tsx`)
 *
 * Layout strategy
 * ----------------
 * All visual elements are positioned in a fixed 1080×2340 Figma artboard (`canvas`),
 * then uniformly scaled to fill the device viewport. Bottom-anchoring keeps the
 * footer wave flush with the physical screen edge (including the home-indicator
 * safe area on iOS / edge-to-edge Android).
 *
 * Figma source
 * ------------
 * File: Mobile Application for XYZ
 * Frame: START (1080×2340)
 *
 * Layer stack (back → front)
 * --------------------------
 * 1. Background concentric rings (Ellipse 23–26)
 * 2. Headline + subcopy
 * 3. Hero halo (Ellipse 35–36) + hero photograph
 * 4. Bottom wave (teal gradient vector)
 * 5. Floating white cards + mask icons + 3D stickers
 * 6. Decorative swirl arrow (raster)
 * 7. “Get Started” pill CTA
 */

import { LinearGradient } from "expo-linear-gradient";
import { useRouter, type Href } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  Ellipse as SvgEllipse,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import { colors } from "@/src/constants/theme";
import { ArrowWithContinue } from "@/src/screens/Auth/components/arrow-with-continue";

// =============================================================================
// Artboard — master coordinate system (all `top` / `left` values are relative
// to this 1080×2340 box before viewport scaling is applied).
// =============================================================================

/** Figma START frame width (px). */
const DESIGN_W = 1080;

/** Figma START frame height (px). */
const DESIGN_H = 2340;

// =============================================================================
// Bottom wave — teal footer vector (Figma vector + horizontal gradient).
// Height is intentionally taller than the original 151.5px export so the curve
// reads more prominently on tall phones after cover-scale.
// =============================================================================

/** Wave bounding width (Figma: 1078px, offset 2px from artboard left). */
const WAVE_W = 1078;

/** Wave bounding height (boosted from Figma 151.5px). */
const WAVE_H = 230;

/** `top` so the wave’s bottom edge aligns with `DESIGN_H`. */
const WAVE_TOP = DESIGN_H - WAVE_H;

/**
 * Cubic-bezier control-point Y values, scaled proportionally from the original
 * 151.5px-tall path so the curve shape is preserved at the new height.
 */
const WAVE_CURVE_PEAK_Y = (100.4 * WAVE_H) / 151.5;
const WAVE_CURVE_MID_Y = (41.8333 * WAVE_H) / 151.5;

// =============================================================================
// Navigation
// =============================================================================

/** Expo Router path for the login flow (first auth step). */
const AUTH_LOGIN = "/(auth)/login" as Href;

// =============================================================================
// Get Started CTA — Figma node 2202:304 (GetStartedBtn) / 537:300 (background)
// =============================================================================

/** Pill button width (px). */
const GET_STARTED_BTN_W = 461;

/** Pill button height (px); border-radius = height / 2 for a capsule shape. */
const GET_STARTED_BTN_H = 112;

/** Vertical position on the artboard (Figma `top: 546px`). */
const GET_STARTED_BTN_TOP = 546;

/** `ArrowWithContinue` render size inside the button (Figma ~52px frame). */
const GET_STARTED_ARROW_SIZE = 52;

/** Arrow wrapper `top` inside the button (vertically centers ~52px in 112px). */
const GET_STARTED_ARROW_TOP = 30;

// =============================================================================
// Decorative swirl arrow — Figma 390:489 (pre-rendered asset, not rebuilt in SVG)
// =============================================================================

const SWIRL_ARROW_COLORED = require("@/assets/images/start/swirl-arrow-colored.png");

/** Raster frame width (Figma). */
const SWIRL_W = 342.005;

/** Raster frame height (Figma). */
const SWIRL_H = 244.038;

// =============================================================================
// Popped 3D sticker assets — overlaid on the floating white squares
// =============================================================================

const Popped3dHeartIcon = require("@/assets/images/start/popped-3d-heart.png");
const Popped3dArchIcon = require("@/assets/images/start/popped-3d-arch.png");
const Popped3dMegaphoneIcon = require("@/assets/images/start/popped-3d-megaphone.png");

// =============================================================================
// Component
// =============================================================================

export default function StartScreen() {
  const router = useRouter();
  const { width: screenW, height: screenH } = useWindowDimensions();
  const { bottom: bottomInset } = useSafeAreaInsets();

  // ---------------------------------------------------------------------------
  // Responsive scale — “cover” fit + bottom anchor
  // ---------------------------------------------------------------------------
  // `layoutH` includes the bottom safe inset so art can draw behind the home bar.
  // `scale` is the larger of width-fit and height-fit so there is no letterboxing.
  // `translateY` shifts the canvas up when height-fit wins, cropping the top
  // instead of leaving a gap above the wave.
  // ---------------------------------------------------------------------------

  const layoutH = screenH + bottomInset;
  const scaleX = screenW / DESIGN_W;
  const scaleY = layoutH / DESIGN_H;
  const scale = Math.max(scaleX, scaleY);
  const scaledH = DESIGN_H * scale;
  const translateY = layoutH - scaledH;

  return (
    // Clips overflow from cover-scale; negative margin bleeds into bottom inset.
    <View style={[styles.viewport, { marginBottom: -bottomInset }]}>
      {/* Fixed-size artboard; transform applied at runtime per device. */}
      <View
        style={[
          styles.canvas,
          {
            transform: [{ scale }, { translateY }],
            transformOrigin: "top left",
          },
        ]}
      >
        {/* ================================================================= */}
        {/* BACKGROUND — concentric teal gradient rings (Figma Ellipse 23–26)  */}
        {/* Stroke: #1D6279 at 4% → 0% opacity. `pointerEvents="none"`.       */}
        {/* ================================================================= */}

        {/* Ellipse 23 — outermost ring (1412×1412, partial off-screen). */}
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

        {/* Ellipse 24 — second ring (1033×1032). */}
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

        {/* Ellipse 25 — third ring (663×664). */}
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

        {/* Ellipse 26 — innermost ring (240×240). */}
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

        {/* ================================================================= */}
        {/* TYPOGRAPHY — hero headline + placeholder subcopy                  */}
        {/* ================================================================= */}

        {/* Primary headline — Lexend Deca Medium, 87px (Figma). */}
        <Text style={[styles.findTheBest, styles.getStartedTypo]}>
          find the best service here
        </Text>

        {/* Secondary line — Poppins Regular, muted gray (placeholder copy). */}
        <Text style={[styles.findTheBest2, styles.textFlexBox]}>
          {
            "find the best servics herefind the best servics here find the best "
          }
        </Text>

        {/* ================================================================= */}
        {/* HERO — cream halo, gold dashed ring, photograph                     */}
        {/* ================================================================= */}

        {/* Ellipse 35 — solid cream circle behind the hero (#FFFFE8). */}
        <View style={styles.ellipse35Wrap} pointerEvents="none">
          <Svg width={1013} height={1013} viewBox="0 0 1013 1013">
            <Circle cx={506.5} cy={506.5} r={506.5} fill="#FFFFE8" />
          </Svg>
        </View>

        {/* Ellipse 36 — dashed gold border ring (#BA8900, 4px stroke). */}
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

        {/* Hero photo — large bitmap, intentionally overflows artboard bounds. */}
        <Image
          source={require("@/assets/images/start/hero.png")}
          style={styles.happyTeenagerShowingPositivIcon}
          resizeMode="cover"
        />

        {/* ================================================================= */}
        {/* FOOTER WAVE — teal gradient vector, pinned to artboard bottom       */}
        {/* Gradient: #165D75 → #177EA1 (matches auth Continue button).       */}
        {/* ================================================================= */}

        <View style={styles.waveWrap}>
          <Svg
            width={WAVE_W}
            height={WAVE_H}
            viewBox={`0 0 ${WAVE_W} ${WAVE_H}`}
            preserveAspectRatio="none"
          >
            <Defs>
              <SvgLinearGradient
                id="startWaveGrad"
                x1="0"
                y1={WAVE_H / 2}
                x2={WAVE_W}
                y2={WAVE_H / 2}
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="0" stopColor="#165D75" />
                <Stop offset="1" stopColor="#177EA1" />
              </SvgLinearGradient>
            </Defs>
            <Path
              d={`M1078 0C735.2 ${WAVE_CURVE_PEAK_Y} 216.5 ${WAVE_CURVE_MID_Y} 0 0V${WAVE_H}H1078V0Z`}
              fill="url(#startWaveGrad)"
            />
          </Svg>
        </View>

        {/* ================================================================= */}
        {/* FLOATING CARDS — white rounded squares with drop shadow           */}
        {/* Shared layout: 138×138, 29px radius (`startChildLayout`).         */}
        {/* ================================================================= */}

        {/* Bottom-left empty card on the hero circle. */}
        <View style={[styles.rectangleView, styles.startChildLayout]} />

        {/* Card behind the megaphone 3D sticker. */}
        <View style={[styles.MegaphoneBgSquare, styles.startChildLayout]} />

        {/* Card behind the heart 3D sticker. */}
        <View style={[styles.HeartBgSquare, styles.startChildLayout]} />

        {/* Bottom-right empty card on the hero circle. */}
        <View style={[styles.startChild6, styles.startChildLayout]} />

        {/* ================================================================= */}
        {/* MASK ICONS — tinted accent glyphs (opacity 0.3) on upper area     */}
        {/* Uses `colors.startAccent` via `ACCENT` constant.                  */}
        {/* ================================================================= */}

        <Image
          source={require("@/assets/images/start/lightbulb-mask.png")}
          style={[styles.BulbIcon, { tintColor: ACCENT }]}
          resizeMode="contain"
        />
        <Image
          source={require("@/assets/images/start/globe-mask.png")}
          style={[styles.GlobeIcon, { tintColor: ACCENT }]}
          resizeMode="contain"
        />

        {/* ================================================================= */}
        {/* 3D STICKERS — PNG overlays aligned to each floating card           */}
        {/* ================================================================= */}

        <Image
          source={Popped3dHeartIcon}
          style={styles.Popped3dHeartIcon}
          resizeMode="contain"
        />
        <Image
          source={Popped3dArchIcon}
          style={styles.Popped3dArchIcon}
          resizeMode="contain"
        />
        <Image
          source={Popped3dMegaphoneIcon}
          style={styles.Popped3dMegaphoneIcon}
          resizeMode="contain"
        />

        {/* ================================================================= */}
        {/* DECORATIVE SWIRL — points toward the Get Started CTA              */}
        {/* Non-interactive (`pointerEvents="none"`).                         */}
        {/* ================================================================= */}

        <View style={styles.swirlArrowOuter} pointerEvents="none">
          <Image
            source={SWIRL_ARROW_COLORED}
            style={styles.swirlArrowImage}
            resizeMode="contain"
          />
        </View>

        {/* ================================================================= */}
        {/* CTA — “Get Started” pill button (Figma 2202:304)                  */}
        {/* Reuses auth gradient + `ArrowWithContinue` (Figma 390:178).       */}
        {/* ================================================================= */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get started"
          onPress={() => router.push(AUTH_LOGIN)}
          style={styles.getStartedBtn}
        >
          <LinearGradient
            colors={["#165d75", "#177ea1"]}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={styles.getStartedGradient}
          />
          <Text style={styles.getStartedBtnText}>Get Started</Text>
          <View style={styles.getStartedArrowWrap}>
            <ArrowWithContinue
              height={GET_STARTED_ARROW_SIZE}
              width={GET_STARTED_ARROW_SIZE}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

// =============================================================================
// Theme tokens & shared style fragments
// =============================================================================

/** Accent tint for mask icons — from `src/constants/theme.ts`. */
const ACCENT = colors.startAccent;

/**
 * Drop shadow applied to all floating white cards (`startChildLayout`).
 * Matches Figma: offset (7, 7), blur 8.5, 10% black.
 */
const CARD_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 7, height: 7 },
  shadowOpacity: 0.1,
  shadowRadius: 8.5,
  elevation: 17,
} as const;

// =============================================================================
// Styles — all positions are in design-space pixels (1080×2340 artboard)
// =============================================================================

const styles = StyleSheet.create({
  // ---------------------------------------------------------------------------
  // Viewport & canvas
  // ---------------------------------------------------------------------------

  /** Full-screen host; cream background matches Figma frame fill (#fffdf8). */
  viewport: {
    flex: 1,
    backgroundColor: "#fffdf8",
    overflow: "hidden",
  },

  /** Unscaled artboard; width/height match `DESIGN_W` × `DESIGN_H`. */
  canvas: {
    width: DESIGN_W,
    height: DESIGN_H,
    backgroundColor: "#fffdf8",
    overflow: "hidden",
  },

  // ---------------------------------------------------------------------------
  // Shared text & card primitives
  // ---------------------------------------------------------------------------

  /** Base for absolutely positioned body text blocks. */
  textFlexBox: {
    textAlign: "left",
    position: "absolute",
  },

  /**
   * Shared headline positioning — horizontally centered via `left: "50%"`
   * plus a negative `marginLeft` on each child style.
   */
  getStartedTypo: {
    fontWeight: "500",
    textAlign: "left",
    color: "#000",
    left: "50%",
    position: "absolute",
  },

  /**
   * Floating white square — 138×138, 29px corner radius, card shadow.
   * Composed with per-card `top` / `left` / `transform` overrides.
   */
  startChildLayout: {
    height: 138,
    width: 138,
    backgroundColor: "#fff",
    borderRadius: 29,
    position: "absolute",
    ...CARD_SHADOW,
  },

  // ---------------------------------------------------------------------------
  // Background rings (Ellipse 23–26)
  // ---------------------------------------------------------------------------

  /** Outermost ring — extends beyond artboard top/left. */
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

  // ---------------------------------------------------------------------------
  // Legacy / unused — retained from an earlier Figma export (status bar area)
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Typography
  // ---------------------------------------------------------------------------

  /** Primary headline — Figma top 207, centered with marginLeft -424. */
  findTheBest: {
    marginLeft: -424,
    top: 207,
    fontSize: 87,
    lineHeight: 83,
    fontFamily: "LexendDeca_500Medium",
    width: 593,
    textTransform: "capitalize",
  },

  /** Subcopy — Figma top 397, #a4a4a4, Poppins 30px. */
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

  // ---------------------------------------------------------------------------
  // Hero halo (Ellipse 35–36)
  // ---------------------------------------------------------------------------

  /** Cream fill circle — centered on hero, Figma top 1570. */
  ellipse35Wrap: {
    marginLeft: -501,
    top: 1570,
    width: 1013,
    height: 1013,
    left: "50%",
    position: "absolute",
  },

  /** Gold dashed ring — slightly inset, Figma top 1599. */
  ellipse36Wrap: {
    marginLeft: -469,
    top: 1599,
    width: 951,
    height: 952,
    left: "50%",
    position: "absolute",
  },

  /** Hero bitmap — oversized to crop naturally at artboard edges. */
  happyTeenagerShowingPositivIcon: {
    top: 1040,
    left: -304,
    width: 1546,
    height: 1910,
    position: "absolute",
  },

  // ---------------------------------------------------------------------------
  // Footer wave
  // ---------------------------------------------------------------------------

  /** Teal wave container — `WAVE_TOP` pins bottom to artboard edge. */
  waveWrap: {
    position: "absolute",
    left: 2,
    top: WAVE_TOP,
    width: WAVE_W,
    height: WAVE_H,
  },

  // ---------------------------------------------------------------------------
  // Floating cards — individual positions & rotations
  // ---------------------------------------------------------------------------

  /** Empty card, bottom-left on hero circle (rotate -14.1°). */
  rectangleView: {
    top: 1942,
    left: 21,
    transform: [{ rotate: "-14.1deg" }],
  },

  /** Megaphone card (rotate -35.42°). */
  MegaphoneBgSquare: {
    top: 1369.5,
    left: 58.51,
    transform: [{ rotate: "-35.42deg" }],
  },

  /** Heart card (rotate 16.82°). */
  HeartBgSquare: {
    top: 1284,
    left: 758.71,
    transform: [{ rotate: "16.82deg" }],
  },

  /** Empty card, bottom-right on hero circle (rotate 6.5°). */
  startChild6: {
    top: 1699,
    left: 878,
    transform: [{ rotate: "6.5deg" }],
  },

  // ---------------------------------------------------------------------------
  // Mask icons (tinted, semi-transparent)
  // ---------------------------------------------------------------------------

  /** Lightbulb mask — upper-left area, rotate -19.31°. */
  BulbIcon: {
    position: "absolute",
    top: 980,
    left: 147,
    width: 163,
    height: 163,
    opacity: 0.3,
    transform: [{ rotate: "-19.31deg" }],
  },

  /** Globe mask — upper-right area, rotate 17.74°. */
  GlobeIcon: {
    position: "absolute",
    top: 964,
    left: 678,
    width: 118,
    height: 118,
    opacity: 0.3,
    transform: [{ rotate: "17.74deg" }],
  },

  // ---------------------------------------------------------------------------
  // 3D stickers
  // ---------------------------------------------------------------------------

  Popped3dHeartIcon: {
    top: 1281,
    left: 755,
    width: 149,
    height: 149,
    transform: [{ rotate: "6.81deg" }],
    position: "absolute",
  },

  Popped3dArchIcon: {
    top: 1700,
    left: 850,
    width: 190,
    height: 130,
    position: "absolute",
  },

  Popped3dMegaphoneIcon: {
    top: 1360,
    left: -10,
    width: 260.82,
    height: 173.88,
    transform: [{ rotate: "-18.26deg" }],
    position: "absolute",
  },

  // ---------------------------------------------------------------------------
  // Decorative swirl arrow
  // ---------------------------------------------------------------------------

  /**
   * Swirl wrapper — Figma left 587.91, top 361.81, rotate 55.59°.
   * Sized to `SWIRL_W` × `SWIRL_H`.
   */
  swirlArrowOuter: {
    position: "absolute",
    left: 587.91,
    top: 361.81,
    width: SWIRL_W,
    height: SWIRL_H,
    transform: [{ rotate: "55.59deg" }],
  },

  swirlArrowImage: {
    width: "100%",
    height: "100%",
  },

  // ---------------------------------------------------------------------------
  // Get Started CTA
  // ---------------------------------------------------------------------------

  /**
   * Pill pressable — Figma 2202:304.
   * `left: 116` centers the 461px button on the 1080px artboard.
   */
  getStartedBtn: {
    position: "absolute",
    left: 116,
    top: GET_STARTED_BTN_TOP,
    width: GET_STARTED_BTN_W,
    height: GET_STARTED_BTN_H,
    borderRadius: GET_STARTED_BTN_H / 2,
    overflow: "hidden",
    justifyContent: "center",
  },

  /** Full-bleed gradient fill behind label + arrow. */
  getStartedGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: GET_STARTED_BTN_H / 2,
  },

  /**
   * Button label — Figma 538:302 (Poppins Medium 36.302px, white).
   * `left: 132` offsets text within the pill.
   */
  getStartedBtnText: {
    position: "absolute",
    left: 132,
    top: (GET_STARTED_BTN_H - 45.378) / 2,
    fontFamily: "Poppins_500Medium",
    fontSize: 36.302,
    lineHeight: 45.378,
    letterSpacing: -1.1344,
    color: "#fff",
  },

  /**
   * Arrow icon container — Figma arrow frame at left 370 inside button.
   * Uses shared `ArrowWithContinue` from auth screens.
   */
  getStartedArrowWrap: {
    position: "absolute",
    left: 370,
    top: GET_STARTED_ARROW_TOP,
    width: GET_STARTED_ARROW_SIZE,
    height: GET_STARTED_ARROW_SIZE,
    zIndex: 1,
  },
});
