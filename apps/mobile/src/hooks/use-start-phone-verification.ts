import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { mapPhoneAuthError, sendSmsPhoneOtp } from "@/src/services/phone-auth";
import { usePhoneAuthFlow } from "@/src/stores/phone-auth-flow";

export function useStartPhoneVerification() {
  const router = useRouter();
  const setSession = usePhoneAuthFlow((s) => s.setSession);
  const [busy, setBusy] = useState(false);

  const start = useCallback(
    async (nationalDigits10: string) => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (nationalDigits10.length !== 10) {
        Alert.alert("Mobile number", "Enter a valid 10-digit mobile number.");
        return;
      }
      const e164 = `+91${nationalDigits10}`;
      setBusy(true);
      try {
        const confirmation = await sendSmsPhoneOtp(e164);
        setSession(e164, confirmation);
        router.push("/(auth)/verify-otp");
      } catch (e) {
        Alert.alert("Couldn't send code", mapPhoneAuthError(e));
      } finally {
        setBusy(false);
      }
    },
    [router, setSession]
  );

  return { start, busy };
}
