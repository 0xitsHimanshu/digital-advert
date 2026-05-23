import MaskedView from "@react-native-masked-view/masked-view";
import { Image, View, type StyleProp, type ViewStyle } from "react-native";

/** Figma 403:519 — alpha mask for the footer doodle shapes (not the fill color). */
const FOOTER_MASK_ASSET = require("@/assets/images/login/otp-footer-mask.png");

/** Figma fill: `#111111` at 8% → `#11111114` */
const FOOTER_FILL = "#11111114";

const FOOTER_DESIGN = {
  left: -40.43,
  width: 1164.202,
  height: 384,
  maskLeft: 29.428,
  maskWidth: 1102.475,
} as const;

type OtpFooterDoodleProps = {
  /** `screenWidth / 1080` */
  scale: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Footer doodle strip — mask PNG + `#111111` @ 8% (Figma 403:521 / 2228:1574).
 * Render last in the tree so it sits above scroll content.
 */
export function OtpFooterDoodle({ scale, style }: OtpFooterDoodleProps) {
  const footerW = FOOTER_DESIGN.width * scale;
  const footerH = FOOTER_DESIGN.height * scale;
  const footerLeft = FOOTER_DESIGN.left * scale;
  const maskLeft = FOOTER_DESIGN.maskLeft * scale;
  const maskW = FOOTER_DESIGN.maskWidth * scale;

  return (
    <View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          bottom: 0,
          left: footerLeft,
          width: footerW,
          height: footerH,
          zIndex: 24,
          elevation: 24,
        },
        style,
      ]}
    >
      <MaskedView
        style={{ width: footerW, height: footerH }}
        maskElement={
          <View
            style={{
              width: footerW,
              height: footerH,
              backgroundColor: "transparent",
            }}
          >
            <Image
              resizeMode="cover"
              source={FOOTER_MASK_ASSET}
              style={{
                position: "absolute",
                left: maskLeft,
                top: 0,
                width: maskW,
                height: footerH,
              }}
            />
          </View>
        }
      >
        <View
          style={{
            width: footerW,
            height: footerH,
            backgroundColor: FOOTER_FILL,
          }}
        />
      </MaskedView>
    </View>
  );
}

/** Scroll padding so content clears the pinned footer on a 1080px-tall design. */
export function otpFooterScrollPadding(scale: number, safeBottom: number): number {
  return FOOTER_DESIGN.height * scale + safeBottom + 16 * scale;
}
