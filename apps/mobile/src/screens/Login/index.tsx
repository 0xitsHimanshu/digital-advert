import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import { useStartPhoneVerification } from "@/src/hooks/use-start-phone-verification";
import {
  CONTINUE_ARROW_FRAME,
  PhoneAuthArtboard,
  styles,
} from "@/src/screens/Auth/phone-auth-artboard";
import { AuthGetStartedSketch } from "@/src/screens/Auth/components/auth-get-started-sketch";
import { ArrowWithContinue } from "@/src/screens/Auth/components/arrow-with-continue";
import { PhoneNumberInput } from "@/src/screens/Auth/components/phone-number-input";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const { start, busy } = useStartPhoneVerification();

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
      return () => setStatusBarStyle("dark");
    }, [])
  );

  const onContinue = () => {
    void start(phone);
  };

  const canSend = phone.length === 10 && !busy;

  return (
    <PhoneAuthArtboard>
      <Text style={styles.heroTitle}>Welcome back </Text>
      <Text style={styles.heroSubtitle}>
        Login to access expert digital marketing services. Customize for your success
      </Text>

      <AuthGetStartedSketch />

      <Text style={styles.fieldLabel}>
        Mobile N<Text style={styles.umber}>UMBER</Text>
      </Text>

      <PhoneNumberInput value={phone} onChangeText={setPhone} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Continue"
        accessibilityState={{ disabled: !canSend }}
        disabled={!canSend}
        onPress={onContinue}
        style={styles.continueBtn}
      >
        <LinearGradient
          colors={canSend ? ["#165d75", "#177ea1"] : ["#a8bdc4", "#8faab4"]}
          end={{ x: 1, y: 0 }}
          pointerEvents="none"
          start={{ x: 0, y: 0 }}
          style={styles.continueGradient}
        />
        <Text style={styles.continueText}>{busy ? "Sending..." : "Continue"}</Text>
        <View style={[styles.arrowWrap, busy && { opacity: 0 }]}>
          <ArrowWithContinue
            height={CONTINUE_ARROW_FRAME}
            width={CONTINUE_ARROW_FRAME}
          />
        </View>
        {busy ? (
          <View
            accessibilityElementsHidden
            pointerEvents="none"
            style={{
              position: "absolute",
              inset: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator color="#ffffff" />
          </View>
        ) : null}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sign up"
        onPress={() => router.push("/(auth)/signup")}
        style={styles.footerPress}
      >
        <Text>
          <Text style={styles.footerGrey}>Don’t have an account? </Text>
          <Text style={styles.footerBold}>Sign up</Text>
        </Text>
      </Pressable>
    </PhoneAuthArtboard>
  );
}
