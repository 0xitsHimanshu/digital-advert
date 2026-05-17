import { Platform } from "react-native";
import auth from "@react-native-firebase/auth";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";

export async function sendSmsPhoneOtp(
  e164PhoneNumber: string
): Promise<FirebaseAuthTypes.ConfirmationResult> {
  if (Platform.OS === "web") {
    throw new Error("Phone sign-in runs in the native app (dev build), not on web.");
  }
  return auth().signInWithPhoneNumber(e164PhoneNumber);
}

export function mapPhoneAuthError(error: unknown): string {
  const code =
    typeof error === "object" &&
    error &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
      ? (error as { code: string }).code
      : "";

  switch (code) {
    case "auth/too-many-requests":
      return "Too many attempts. Please wait before requesting another code.";
    case "auth/invalid-phone-number":
      return "That phone number does not look valid.";
    case "auth/invalid-verification-code":
      return "That code is incorrect. Try again.";
    case "auth/code-expired":
      return "This code has expired. Request a new one.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded. Try again later or contact support.";
    case "auth/operation-not-allowed":
      return "Phone sign-in is not enabled for this project.";
    default:
      if (error instanceof Error && error.message) return error.message;
      return "Something went wrong. Please try again.";
  }
}
