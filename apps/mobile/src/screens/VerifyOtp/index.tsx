import MaskedView from "@react-native-masked-view/masked-view";
import auth from "@react-native-firebase/auth";
import axios from "axios";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter, type Href } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from "react-native";
import Animated from "react-native-reanimated";
import {
  authAssets,
  CONTINUE_ARROW_FRAME,
  OTP_CONTINUE_ARROW_TOP,
  OTP_CONTINUE_BTN_TOP,
  PhoneAuthArtboard,
  styles,
} from "@/src/screens/Auth/phone-auth-artboard";
import { ArrowWithContinue } from "@/src/screens/Auth/components/arrow-with-continue";
import { OtpPage1Illustration } from "@/src/screens/VerifyOtp/components/otp-page1-illustration";
import { useOtpKeyboardShift } from "@/src/screens/VerifyOtp/hooks/use-otp-keyboard-shift";
import {
  exchangeFirebaseIdTokenForJwt,
  formatAuthApiError,
} from "@/src/services/auth-api";
import { mapPhoneAuthError, sendSmsPhoneOtp } from "@/src/services/phone-auth";
import { saveOnboardingSession } from "@/src/services/onboarding-session";
import { saveCustomerSessionTokens } from "@/src/services/session-tokens";
import { usePhoneAuthFlow } from "@/src/stores/phone-auth-flow";

const OTP_LEN = 6;
const RESEND_SECONDS = 28;

const HOME = "/(tabs)/home-tab" as Href;
const SAVE_DETAILS = "/(auth)/save-details" as Href;

function otpMaskTail(e164: string | null): string {
  const national = e164?.replace(/^\+91/, "").replace(/\D/g, "") ?? "";
  const tail = national.slice(-10);
  if (tail.length < 5) return "—";
  return tail.slice(-5);
}

function describeVerifyError(error: unknown): string {
  if (axios.isAxiosError(error)) return formatAuthApiError(error);
  return mapPhoneAuthError(error);
}

export default function VerifyOtpScreen() {
  const router = useRouter();
  const e164Phone = usePhoneAuthFlow((s) => s.e164Phone);
  const setPhoneSession = usePhoneAuthFlow((s) => s.setSession);
  const clearFlow = usePhoneAuthFlow((s) => s.clear);

  const [digits, setDigits] = useState<string[]>(() =>
    Array(OTP_LEN).fill("")
  );
  const [resendLeft, setResendLeft] = useState(RESEND_SECONDS);
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const filled = digits.every((d) => d.length === 1);
  const otpHintDigits = otpMaskTail(e164Phone);

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
      return () => setStatusBarStyle("dark");
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const { confirmation, e164Phone: pending } =
        usePhoneAuthFlow.getState();
      if (!confirmation || !pending) {
        router.replace("/(auth)/login");
      }
    }, [router])
  );

  useEffect(() => {
    const t = setInterval(() => {
      setResendLeft((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const otpSheetShiftStyle = useOtpKeyboardShift();

  const applyPastedOtp = (text: string) => {
    const chars = text.replace(/\D/g, "").slice(0, OTP_LEN).split("");
    if (chars.length === 0) return;
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < OTP_LEN; i++) next[i] = chars[i] ?? "";
      return next;
    });
    const last = Math.min(chars.length, OTP_LEN) - 1;
    if (last >= 0) inputsRef.current[last]?.focus();
  };

  const setDigitAt = (index: number, value: string) => {
    const d = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = d;
      return next;
    });
    if (d && index < OTP_LEN - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const onKeyPress = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key !== "Backspace") return;
    if (!digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onContinue = () => {
    if (!filled || busy) return;
    void (async () => {
      const live = usePhoneAuthFlow.getState().confirmation;
      if (!live) {
        Alert.alert(
          "Verification",
          "Your session expired. Enter your mobile number again."
        );
        router.replace("/(auth)/login");
        return;
      }
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setBusy(true);
      try {
        await live.confirm(digits.join(""));
        const token = await auth().currentUser?.getIdToken(true);
        if (!token) throw new Error("Missing Firebase credentials after verification.");
        const session = await exchangeFirebaseIdTokenForJwt(token);
        await saveCustomerSessionTokens(session.accessToken, session.refreshToken);
        if (!session.profileComplete) {
          await saveOnboardingSession({
            uid: session.uid,
            phoneNumber: session.phoneNumber,
          });
        }
        clearFlow();
        router.replace(session.profileComplete ? HOME : SAVE_DETAILS);
      } catch (e) {
        Alert.alert("Sign-in incomplete", describeVerifyError(e));
      } finally {
        setBusy(false);
      }
    })();
  };

  const onResend = () => {
    if (resendLeft > 0 || resending) return;
    const pending = usePhoneAuthFlow.getState().e164Phone;
    if (!pending) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    void (async () => {
      setResending(true);
      try {
        const nextConfirmation = await sendSmsPhoneOtp(pending);
        setPhoneSession(pending, nextConfirmation);
        setResendLeft(RESEND_SECONDS);
        setDigits(Array(OTP_LEN).fill(""));
        inputsRef.current[0]?.focus();
      } catch (e) {
        Alert.alert("Resend failed", mapPhoneAuthError(e));
      } finally {
        setResending(false);
      }
    })();
  };

  const mmss =
    resendLeft > 0
      ? `0:${String(resendLeft).padStart(2, "0")}`
      : "0:00";

  const canContinue = filled && !busy;

  return (
    <PhoneAuthArtboard>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.otpSheetShift, otpSheetShiftStyle]}
      >
        <View style={styles.otpPanelShadow} pointerEvents="none" />
        <View style={styles.otpPanel} pointerEvents="none" />

        {/** Figma 390:223 — Page-1 / OTP hero (percentage bounds = Dev Mode inset) */}
        <View style={styles.otpPage1Wrap} pointerEvents="none">
          <OtpPage1Illustration style={styles.otpPage1Svg} />
        </View>

        <Text style={styles.otpTitle}>Verify Otp</Text>

        <Text style={styles.otpInstruction}>
          We sent a 6-digit verification code to the number ending with{" "}
          <Text style={styles.otpInstructionStrong}>XXXXX{otpHintDigits}</Text>
        </Text>

        <View style={styles.otpRow}>
          {digits.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.otpCell,
                digit ? styles.otpCellFilled : styles.otpCellEmpty,
              ]}
            >
              <TextInput
                ref={(r) => {
                  inputsRef.current[index] = r;
                }}
                accessibilityLabel={`Digit ${index + 1} of ${OTP_LEN}`}
                keyboardType="number-pad"
                onChangeText={(t) => {
                  const cleaned = t.replace(/\D/g, "");
                  if (cleaned.length > 1) {
                    applyPastedOtp(cleaned);
                    return;
                  }
                  setDigitAt(index, cleaned);
                }}
                onKeyPress={(e) => onKeyPress(index, e)}
                selectTextOnFocus
                style={styles.otpDigit}
                textAlign="center"
                value={digit}
              />
            </View>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canContinue }}
          accessibilityLabel="Continue"
          disabled={!canContinue}
          onPress={onContinue}
          style={[styles.continueBtn, { top: OTP_CONTINUE_BTN_TOP }]}
        >
          {canContinue ? (
            <LinearGradient
              colors={["#165d75", "#177ea1"]}
              end={{ x: 1, y: 0 }}
              pointerEvents="none"
              start={{ x: 0, y: 0 }}
              style={styles.continueGradient}
            />
          ) : (
            <LinearGradient
              colors={["#a8bdc4", "#8faab4"]}
              end={{ x: 1, y: 0 }}
              pointerEvents="none"
              start={{ x: 0, y: 0 }}
              style={styles.continueGradient}
            />
          )}
          <View
            pointerEvents="box-none"
            style={styles.continueBtnForeground}
          >
            <Text style={styles.continueText}>
              {busy ? "Verifying..." : "Continue"}
            </Text>
            <View
              collapsable={false}
              style={[
                styles.arrowWrap,
                {
                  top: OTP_CONTINUE_ARROW_TOP,
                  opacity: busy ? 0 : 1,
                },
              ]}
            >
              <ArrowWithContinue
                height={CONTINUE_ARROW_FRAME}
                width={CONTINUE_ARROW_FRAME}
              />
            </View>
          </View>
          {busy ? (
            <View
              accessibilityElementsHidden
              pointerEvents="none"
              style={{
                ...styles.continueBtnForeground,
                alignItems: "center",
              }}
            >
              <ActivityIndicator color="#ffffff" />
            </View>
          ) : null}
        </Pressable>

        <View style={styles.otpResendRow}>
          <Text style={styles.otpResendText}>
            <Text style={styles.otpResendTimer}>Resend OTP in {mmss}</Text>
            <Text> </Text>
            <Text
              onPress={() => void onResend()}
              style={[
                styles.otpResendLink,
                (resendLeft > 0 || resending) && { opacity: 0.45 },
              ]}
            >
              {resending ? "Sending…" : "Resend OTP"}
            </Text>
          </Text>
        </View>

        {/** Figma 403:521 — masked footer doodle strip */}
        <View
          style={[
            styles.otpFooterMaskOuter,
            { zIndex: 24, elevation: 24 },
          ]}
          pointerEvents="none"
        >
          <MaskedView
            style={styles.otpFooterMaskedView}
            maskElement={
              <View style={styles.otpFooterMaskCanvas}>
                <Image
                  resizeMode="cover"
                  source={authAssets.otpFooterMask}
                  style={styles.otpFooterArtworkImage}
                />
              </View>
            }
          >
            <View style={styles.otpFooterMaskFill} />
          </MaskedView>
        </View>
      </Animated.View>
    </PhoneAuthArtboard>
  );
}
