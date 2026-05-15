import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
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

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
      return () => setStatusBarStyle("dark");
    }, [])
  );

  const onContinue = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(auth)/verify-otp");
  };

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
        onPress={onContinue}
        style={styles.continueBtn}
      >
        <LinearGradient
          colors={["#165d75", "#177ea1"]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={styles.continueGradient}
        />
        <Text style={styles.continueText}>Continue</Text>
        <View style={styles.arrowWrap}>
          <ArrowWithContinue
            height={CONTINUE_ARROW_FRAME}
            width={CONTINUE_ARROW_FRAME}
          />
        </View>
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
