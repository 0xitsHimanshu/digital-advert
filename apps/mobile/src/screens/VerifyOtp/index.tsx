import MaskedView from "@react-native-masked-view/masked-view";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter, type Href } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from "react-native";
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

const OTP_LEN = 5;
const RESEND_SECONDS = 28;

/** Dev-only: skip OTP entry and hit Continue to preview `/home` (no API yet). */
const DEV_SKIP_OTP_CHECK = __DEV__;

const HOME = "/(tabs)/home-tab" as Href;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(() =>
    Array(OTP_LEN).fill("")
  );
  const [resendLeft, setResendLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const filled = digits.every((d) => d.length === 1);
  const canSubmit = filled || DEV_SKIP_OTP_CHECK;

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
      return () => setStatusBarStyle("dark");
    }, [])
  );

  useEffect(() => {
    const t = setInterval(() => {
      setResendLeft((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

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
    if (!canSubmit) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: replace with real OTP verification API; then navigate on success.
    router.replace(HOME);
  };

  const onResend = () => {
    if (resendLeft > 0) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setResendLeft(RESEND_SECONDS);
  };

  const mmss =
    resendLeft > 0
      ? `0:${String(resendLeft).padStart(2, "0")}`
      : "0:00";

  return (
    <PhoneAuthArtboard>
      <View style={styles.otpPanelShadow} pointerEvents="none" />
      <View style={styles.otpPanel} pointerEvents="none" />

      {/** Figma 390:223 — Page-1 / OTP hero (percentage bounds = Dev Mode inset) */}
      <View style={styles.otpPage1Wrap} pointerEvents="none">
        <OtpPage1Illustration style={styles.otpPage1Svg} />
      </View>

      <Text style={styles.otpTitle}>Verify Otp</Text>

      <Text style={styles.otpInstruction}>
        We sent a verification 5 digit code on your number that ends with
        <Text style={styles.otpInstructionStrong}> XXXXX97567</Text>
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
        accessibilityState={{ disabled: !canSubmit }}
        accessibilityLabel="Continue"
        disabled={!canSubmit}
        onPress={onContinue}
        style={[styles.continueBtn, { top: OTP_CONTINUE_BTN_TOP }]}
      >
        {canSubmit ? (
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
          <Text style={styles.continueText}>Continue</Text>
          <View
            collapsable={false}
            style={[
              styles.arrowWrap,
              {
                top: OTP_CONTINUE_ARROW_TOP,
              },
            ]}
          >
            <ArrowWithContinue
              height={CONTINUE_ARROW_FRAME}
              width={CONTINUE_ARROW_FRAME}
            />
          </View>
        </View>
      </Pressable>

      <View style={styles.otpResendRow}>
        <Text style={styles.otpResendText}>
          <Text style={styles.otpResendTimer}>Resend OTP in {mmss}</Text>
          <Text> </Text>
          <Text
            onPress={onResend}
            style={[
              styles.otpResendLink,
              resendLeft > 0 && { opacity: 0.45 },
            ]}
          >
            Resend OTP
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
                source={authAssets.otpFooterMask}
                style={styles.otpFooterArtworkImage}
                resizeMode="cover"
              />
            </View>
          }
        >
          <View style={styles.otpFooterMaskFill} />
        </MaskedView>
      </View>
    </PhoneAuthArtboard>
  );
}
