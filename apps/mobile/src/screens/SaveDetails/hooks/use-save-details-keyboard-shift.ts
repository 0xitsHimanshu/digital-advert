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
import {
  DESIGN_W,
  SAVE_CONTENT_BOTTOM_DESIGN,
} from "@/src/screens/SaveDetails/save-details-layout";

const SHIFT_MARGIN_SCREEN = 56;
/** Allow header + form to slide up enough to clear the keyboard. */
const MAX_SHIFT_DESIGN = 1100;
const ANIM_MS = 280;

function shiftForKeyboard(event: KeyboardEvent, scale: number): number {
  const keyboardTop = event.endCoordinates.screenY;
  const contentBottomScreen = SAVE_CONTENT_BOTTOM_DESIGN * scale;
  const neededScreen = Math.max(
    0,
    contentBottomScreen - keyboardTop + SHIFT_MARGIN_SCREEN
  );
  return Math.min(MAX_SHIFT_DESIGN, neededScreen / scale);
}

/**
 * Shifts the Save Details header (teal + rings) and form upward in design-space
 * when the keyboard opens. Footer artwork stays fixed on the artboard.
 */
export function useSaveDetailsKeyboardShift() {
  const translateY = useSharedValue(0);
  const scale = Dimensions.get("window").width / DESIGN_W;

  const resetShift = useCallback(() => {
    cancelAnimation(translateY);
    translateY.value = 0;
    Keyboard.dismiss();
  }, [translateY]);

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
