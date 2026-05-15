import { useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";
import { Dimensions, Keyboard, Platform, type KeyboardEvent } from "react-native";
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { DESIGN_W } from "@/src/screens/Auth/phone-auth-artboard";

/** Lowest interactive row on OTP sheet (resend link), design-space px from artboard top. */
const OTP_SHEET_BOTTOM_DESIGN = 1920;

/** Extra breathing room between keyboard top and sheet content (screen px). */
const SHIFT_MARGIN_SCREEN = 40;

/** Cap shift so the header illustration does not slide off-screen. */
const MAX_SHIFT_DESIGN = 780;

const ANIM_MS = 280;

function shiftForKeyboard(event: KeyboardEvent, scale: number): number {
  const keyboardTop = event.endCoordinates.screenY;
  const sheetBottomScreen = OTP_SHEET_BOTTOM_DESIGN * scale;
  const neededScreen = Math.max(
    0,
    sheetBottomScreen - keyboardTop + SHIFT_MARGIN_SCREEN
  );
  return Math.min(MAX_SHIFT_DESIGN, neededScreen / scale);
}

/**
 * Animated `translateY` (design-space) for the OTP white sheet when the number pad opens.
 * Works with the scaled `PhoneAuthArtboard` canvas — offset is applied inside design coords.
 */
export function useOtpKeyboardShift() {
  const translateY = useSharedValue(0);
  const scale = Dimensions.get("window").width / DESIGN_W;

  const resetShift = useCallback(() => {
    cancelAnimation(translateY);
    translateY.value = 0;
    Keyboard.dismiss();
  }, [translateY]);

  /** Leaving the screen (back, replace) — reset before transition; keyboard hide may arrive too late. */
  useFocusEffect(
    useCallback(() => {
      return () => {
        resetShift();
      };
    }, [resetShift])
  );

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = Keyboard.addListener(showEvent, (e) => {
      const shift = shiftForKeyboard(e, scale);
      translateY.value = withTiming(-shift, {
        duration: ANIM_MS,
        easing: Easing.out(Easing.cubic),
      });
    });

    const onHide = Keyboard.addListener(hideEvent, () => {
      translateY.value = withTiming(0, {
        duration: ANIM_MS,
        easing: Easing.out(Easing.cubic),
      });
    });

    return () => {
      onShow.remove();
      onHide.remove();
      resetShift();
    };
  }, [scale, translateY, resetShift]);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
}
