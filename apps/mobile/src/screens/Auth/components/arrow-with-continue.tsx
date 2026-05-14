import type { ComponentProps } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type ArrowProps = Omit<ComponentProps<typeof Svg>, "width" | "height"> & {
  width?: number;
  height?: number;
};

/**
 * Figma 390:178 — Iconly / Bold / Arrow icon used in the Continue button across
 * login, signup, and verify-otp. The vector is authored pointing right, so callers
 * should not apply a rotation wrapper.
 *
 * NOTE: width/height are mirrored onto `style` so React Native's flex layout
 * picks up the box size. Without this, react-native-svg can render at 0×0 when
 * placed in a parent with `alignItems/justifyContent: 'center'`.
 */
export function ArrowWithContinue({
  width = 68,
  height = 68,
  style,
  ...rest
}: ArrowProps) {
  const sizeStyle: StyleProp<ViewStyle> = { width, height };
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 68 68"
      fill="none"
      style={[sizeStyle, style]}
      {...rest}
    >
      <Path
        d="M36.6978 50.5862C35.8058 50.5862 34.9535 50.3786 34.1411 49.97C33.1266 49.3974 32.3173 48.4937 31.8697 47.429C31.5845 46.6922 31.1372 44.478 31.1372 44.4378C30.7269 42.206 30.4888 38.6844 30.4546 34.7376L30.4497 33.7425C30.4497 29.6068 30.6923 25.8361 31.0572 23.3782L31.3765 21.8499C31.5543 21.0404 31.788 20.1183 32.0318 19.6477C32.924 17.9267 34.6687 16.8616 36.5357 16.8616H36.6978C37.9116 16.9017 40.4585 17.9645 40.4722 18.0071C44.5865 19.7334 52.524 24.9441 56.19 28.6585L57.2554 29.7737C57.5343 30.0759 57.848 30.4335 58.0425 30.7122C58.6923 31.5727 59.0171 32.6376 59.0171 33.7024C59.0171 34.8912 58.6522 35.9967 57.9624 36.9007L56.8677 38.0813L56.6226 38.3333C53.2963 41.9396 44.6115 47.8369 40.0679 49.6419L39.3814 49.9046C38.5559 50.2004 37.3991 50.5537 36.6978 50.5862ZM12.6558 37.9886C10.3227 37.9886 8.4312 36.0787 8.43118 33.7229C8.43118 31.3671 10.3227 29.4573 12.6558 29.4573L23.0513 30.3763C24.8816 30.3763 26.3658 31.8748 26.3658 33.7229C26.3657 35.5741 24.8816 37.0696 23.0513 37.0696L12.6558 37.9886Z"
        fill="white"
      />
    </Svg>
  );
}

export default ArrowWithContinue;
