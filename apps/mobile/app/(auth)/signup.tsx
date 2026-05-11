import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useCallback, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import {
  CONTINUE_ARROW_FRAME,
  PhoneAuthArtboard,
  styles,
} from "@/app/(auth)/phone-auth-artboard";
import { ArrowWithContinue } from "@/components/arrow-with-continue";

export default function SignupScreen() {
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
  };

  return (
    <PhoneAuthArtboard>
      <Text style={styles.heroTitle}>Sign up</Text>
      <Text style={styles.heroSubtitle}>
        Enter your mobile number to continue.
      </Text>

      <Text style={styles.fieldLabel}>
        Mobile N<Text style={styles.umber}>UMBER</Text>
      </Text>

      <View style={styles.inputShell}>
        <TextInput
          accessibilityLabel="Mobile number"
          keyboardType="phone-pad"
          onChangeText={setPhone}
          placeholder="+91 XXXXXXXX"
          placeholderTextColor="#989898"
          style={styles.input}
          value={phone}
        />
      </View>

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
        accessibilityLabel="Log in"
        onPress={() => router.push("/(auth)/login")}
        style={styles.footerPress}
      >
        <Text>
          <Text style={styles.footerGrey}>Already have an account? </Text>
          <Text style={styles.footerBold}>Log in</Text>
        </Text>
      </Pressable>
    </PhoneAuthArtboard>
  );
}
