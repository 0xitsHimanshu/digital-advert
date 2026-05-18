import MaskedView from "@react-native-masked-view/masked-view";
import {
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import type { ReactNode } from "react";

import {
  DESIGN_H,
  DESIGN_W,
  SAVE_DOODLE_LEFT,
  SAVE_DOODLE_TOP,
  SAVE_HEADER_HEIGHT,
  SAVE_HEADER_TOP,
} from "@/src/screens/SaveDetails/save-details-layout";

const saveDetailsAssets = {
  footerMask: require("@/assets/images/login/otp-footer-mask.png"),
  headerDoodle: require("@/assets/images/login/group2848.png"),
} as const;

const { width: SCREEN_W } = Dimensions.get("window");

function SaveHeaderRing24() {
  return (
    <Svg width={1340} height={1340} viewBox="0 0 1412 1412">
      <Defs>
        <SvgLinearGradient
          id="saveRing24"
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
        stroke="url(#saveRing24)"
        strokeWidth={130}
      />
    </Svg>
  );
}

function SaveHeaderRing25() {
  return (
    <Svg width={861} height={862} viewBox="0 0 1033 1032">
      <Defs>
        <SvgLinearGradient
          id="saveRing25"
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
        stroke="url(#saveRing25)"
        strokeWidth={130}
      />
    </Svg>
  );
}

function SaveHeaderRing39() {
  return (
    <Svg width={369} height={368} viewBox="0 0 663 664">
      <Defs>
        <SvgLinearGradient
          id="saveRing39"
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
        stroke="url(#saveRing39)"
        strokeWidth={130}
      />
    </Svg>
  );
}

type SaveDetailsArtboardProps = {
  children: ReactNode;
  /** Animated translateY for header + form when keyboard is open. */
  keyboardShiftStyle?: StyleProp<ViewStyle>;
};

/**
 * Standalone Save Details canvas — shorter teal header than login/OTP,
 * footer doodle fixed at bottom, header + form shift up with keyboard.
 */
const FOOTER_DESIGN_W = 1164.202;
const FOOTER_DESIGN_H = 384;
const FOOTER_DESIGN_LEFT = -40.43;

export function SaveDetailsArtboard({
  children,
  keyboardShiftStyle,
}: SaveDetailsArtboardProps) {
  const scale = SCREEN_W / DESIGN_W;
  const scaledH = DESIGN_H * scale;
  const footerScreenH = FOOTER_DESIGN_H * scale;
  const footerScreenW = FOOTER_DESIGN_W * scale;
  const footerScreenLeft = FOOTER_DESIGN_LEFT * scale;

  return (
    <Pressable
      style={artboardStyles.viewport}
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <View
        style={[artboardStyles.scaleFrame, { width: SCREEN_W, height: scaledH }]}
        pointerEvents="box-none"
      >
        <View
          style={[
            artboardStyles.canvas,
            { transform: [{ scale }] },
            { transformOrigin: "top left" },
          ]}
          pointerEvents="box-none"
        >
          <View style={artboardStyles.creamFill} pointerEvents="none" />

          <Animated.View
            pointerEvents="box-none"
            style={[artboardStyles.shiftLayer, keyboardShiftStyle]}
          >
            <View style={artboardStyles.tealHeader} pointerEvents="none" />

            <View style={artboardStyles.ellipse24Wrap} pointerEvents="none">
              <SaveHeaderRing24 />
            </View>
            <View style={artboardStyles.ellipse25Wrap} pointerEvents="none">
              <SaveHeaderRing25 />
            </View>
            <View style={artboardStyles.ellipse39Wrap} pointerEvents="none">
              <SaveHeaderRing39 />
            </View>

            <View style={artboardStyles.headerDoodleOuter} pointerEvents="none">
              <View style={artboardStyles.headerDoodleInner}>
                <Image
                  source={saveDetailsAssets.headerDoodle}
                  style={artboardStyles.headerDoodleImg}
                />
              </View>
            </View>

            {children}
          </Animated.View>
        </View>
      </View>

      {/** Figma 2212:311 — fixed to device bottom; does not move with keyboard */}
      <View
        style={[
          artboardStyles.footerViewportPin,
          {
            left: footerScreenLeft,
            width: footerScreenW,
            height: footerScreenH,
          },
        ]}
        pointerEvents="none"
      >
        <MaskedView
          style={{ width: footerScreenW, height: footerScreenH }}
          maskElement={
            <View
              style={{
                width: footerScreenW,
                height: footerScreenH,
                backgroundColor: "transparent",
              }}
            >
              <Image
                resizeMode="cover"
                source={saveDetailsAssets.footerMask}
                style={{
                  position: "absolute",
                  left: 29.428 * scale,
                  top: 0,
                  width: 1102.475 * scale,
                  height: footerScreenH,
                }}
              />
            </View>
          }
        >
          <View
            style={{
              width: footerScreenW,
              height: footerScreenH,
              backgroundColor: "rgba(17,17,17,0.08)",
            }}
          />
        </MaskedView>
      </View>
    </Pressable>
  );
}

export const saveDetailsArtboardStyles = StyleSheet.create({
  shiftLayer: {
    position: "absolute",
    left: 0,
    top: 0,
    width: DESIGN_W,
    height: DESIGN_H,
    zIndex: 1,
  },
  saveBtn: {
    zIndex: 4,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 39,
    overflow: "hidden",
  },
  saveGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 39,
  },
  saveBtnForeground: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  saveText: {
    fontFamily: "LexendDeca_600SemiBold",
    fontSize: 40,
    lineHeight: 49,
    letterSpacing: -1.26,
    color: "#fff",
    textAlign: "center",
  },
  saveArrowWrap: {
    position: "absolute",
    zIndex: 3,
  },
});

const artboardStyles = StyleSheet.create({
  viewport: {
    flex: 1,
    backgroundColor: "#fffdf8",
    overflow: "hidden",
    alignItems: "center",
  },
  scaleFrame: {
    overflow: "hidden",
  },
  canvas: {
    width: DESIGN_W,
    height: DESIGN_H,
    backgroundColor: "#fffdf8",
    overflow: "visible",
  },
  creamFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fffdf8",
  },

  /** Figma 2212:314 — shorter teal panel */
  tealHeader: {
    position: "absolute",
    left: 0,
    top: SAVE_HEADER_TOP,
    width: DESIGN_W,
    height: SAVE_HEADER_HEIGHT,
    backgroundColor: "#165d75",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },

  /** Rings scaled for shorter header (Figma 2212:315 / 318) */
  ellipse24Wrap: {
    position: "absolute",
    left: -131,
    top: 35,
    width: 1340,
    height: 1340,
  },
  ellipse25Wrap: {
    position: "absolute",
    left: 110,
    top: 200,
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

  headerDoodleOuter: {
    position: "absolute",
    left: SAVE_DOODLE_LEFT,
    top: SAVE_DOODLE_TOP,
    width: 673.016,
    height: 419.075,
    alignItems: "center",
    justifyContent: "center",
  },
  headerDoodleInner: {
    transform: [{ rotate: "-8.28deg" }],
    width: 631.868,
    height: 331.575,
  },
  headerDoodleImg: {
    width: 631.868,
    height: 331.575,
    resizeMode: "contain",
  },

  /** Pinned to the physical screen bottom — matches Figma footer placement. */
  footerViewportPin: {
    position: "absolute",
    bottom: 0,
    zIndex: 30,
    elevation: 30,
  },
});
