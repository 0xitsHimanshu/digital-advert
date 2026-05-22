import Constants from "expo-constants";
import { NativeModules, Platform } from "react-native";

export type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutStatic = {
  open: (options: Record<string, unknown>) => Promise<RazorpaySuccess>;
};

const NATIVE_MODULE = "RNRazorpayCheckout";

export const RAZORPAY_NATIVE_REBUILD_MESSAGE =
  "Razorpay needs a native development build. From apps/mobile run: npx expo prebuild --clean, then npx expo run:android (or run:ios). Expo Go cannot open Razorpay checkout.";

export function isExpoGo(): boolean {
  return Constants.executionEnvironment === "storeClient";
}

/** True when the Razorpay native bridge is linked into the current binary. */
export function isRazorpayNativeLinked(): boolean {
  if (Platform.OS === "web") return false;
  return NativeModules[NATIVE_MODULE] != null;
}

export function getRazorpayUnavailableReason(): string | null {
  if (Platform.OS === "web") {
    return "Razorpay checkout is only available on iOS and Android.";
  }
  if (isExpoGo()) {
    return "You are on Expo Go, which does not include Razorpay. " + RAZORPAY_NATIVE_REBUILD_MESSAGE;
  }
  if (!isRazorpayNativeLinked()) {
    return RAZORPAY_NATIVE_REBUILD_MESSAGE;
  }
  return null;
}

export function getRazorpayCheckout(): RazorpayCheckoutStatic | null {
  const unavailable = getRazorpayUnavailableReason();
  if (unavailable) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("react-native-razorpay") as {
      default?: RazorpayCheckoutStatic;
    };
    const checkout = mod.default ?? (mod as unknown as RazorpayCheckoutStatic);
    return typeof checkout?.open === "function" ? checkout : null;
  } catch {
    return null;
  }
}

export function isRazorpayNativeError(message: string): boolean {
  return (
    message.includes("open' of null") ||
    message.includes('open" of null') ||
    message.includes("RNRazorpayCheckout") ||
    message.includes("Native module")
  );
}
