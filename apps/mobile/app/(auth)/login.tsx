import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useCallback, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import {
  authAssets,
  PhoneAuthArtboard,
  styles,
} from "@/app/(auth)/phone-auth-artboard";

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
  };

  return (
    <PhoneAuthArtboard>
      <Text style={styles.heroTitle}>Let’s get started</Text>
      <Text style={styles.heroSubtitle}>
        Find trusted services tailored just for you.Find trusted services
        tailored just for you.
      </Text>

      <View style={styles.getStartedSketchOuter} pointerEvents="none">
        <View style={styles.getStartedSketchInner}>
          <Image source={authAssets.group2845} style={styles.group2845Img} />
        </View>
      </View>
      <Text style={styles.getStartedLabel}>Get Started</Text>

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
          <View style={styles.arrowRotate180Outer}>
            <View style={styles.arrowNode178Frame}>
              <Image
                source={authAssets.continueArrow390178}
                style={styles.arrowGlyphAbsolute}
                resizeMode="contain"
              />
            </View>
          </View>
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
