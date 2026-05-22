import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter, type Href } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  buildDiceBearAvatarUrl,
  pickRandomAvatarSeed,
} from "@/src/lib/dicebear-avatar";
import { ArrowWithContinue } from "@/src/screens/Auth/components/arrow-with-continue";
import {
  SaveDetailsArtboard,
  saveDetailsArtboardStyles,
} from "@/src/screens/SaveDetails/components/save-details-artboard";
import { SaveDetailsField } from "@/src/screens/SaveDetails/components/save-details-field";
import { useSaveDetailsKeyboardShift } from "@/src/screens/SaveDetails/hooks/use-save-details-keyboard-shift";
import {
  SAVE_ARROW_FRAME,
  SAVE_ARROW_FRAME_LEFT,
  SAVE_ARROW_TOP,
  SAVE_AVATAR_LEFT,
  SAVE_AVATAR_SIZE,
  SAVE_AVATAR_TOP,
  SAVE_BTN_H,
  SAVE_BTN_LEFT,
  SAVE_BTN_TOP,
  SAVE_BTN_W,
  SAVE_FIELD_SHELL_H,
  SAVE_FIELD_SHELL_LEFT,
  SAVE_FIELD_SHELL_W,
  SAVE_FIELD_LABEL_LEFT,
  saveDetailsFields,
} from "@/src/screens/SaveDetails/save-details-layout";
import {
  clearOnboardingSession,
  loadOnboardingSession,
} from "@/src/services/onboarding-session";
import {
  formatProfileApiError,
  saveCustomerProfile,
} from "@/src/services/profile-api";
import { useAuthNavigationGuard } from "@/src/hooks/use-auth-navigation-guard";
import { saveProfileCompleteFlag } from "@/src/services/session-meta";
import { useAuthSession } from "@/src/stores/auth-session";
import { useCustomerProfile } from "@/src/stores/customer-profile";

const HOME = "/(tabs)/home-tab" as Href;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function nationalDigitsFromE164(e164: string): string {
  return e164.replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10);
}

export default function SaveDetailsScreen() {
  const router = useRouter();
  useAuthNavigationGuard("require-incomplete-profile");
  const markAuthenticated = useAuthSession((s) => s.markAuthenticated);
  const [session, setSession] = useState<{
    uid: string;
    phoneNumber: string;
  } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  /** One Lorelei seed per signup — stable until profile is saved. */
  const [avatarSeed, setAvatarSeed] = useState<string | null>(null);

  const keyboardShiftStyle = useSaveDetailsKeyboardShift();

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
      return () => setStatusBarStyle("dark");
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        const pending = await loadOnboardingSession();
        if (!pending) {
          return;
        }
        setSession(pending);
        setAvatarSeed((current) => current ?? pickRandomAvatarSeed());
      })();
    }, [])
  );

  const avatarUrl = useMemo(
    () => (avatarSeed ? buildDiceBearAvatarUrl(avatarSeed) : null),
    [avatarSeed]
  );

  const phoneDisplay = session
    ? nationalDigitsFromE164(session.phoneNumber)
    : "";

  const nameValid = name.trim().length > 0;
  const emailValid = !email.trim() || EMAIL_RE.test(email.trim());
  const canSave = Boolean(session) && nameValid && emailValid && !busy;

  const onSave = () => {
    if (!canSave || !session || !avatarUrl) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    void (async () => {
      setBusy(true);
      try {
        const profile = await saveCustomerProfile({
          name: name.trim(),
          phoneNumber: session.phoneNumber,
          email: email.trim() || undefined,
          address: address.trim() || undefined,
          avatarUrl,
        });
        await useCustomerProfile.getState().setProfile(profile);
        await clearOnboardingSession();
        await saveProfileCompleteFlag(true);
        markAuthenticated(true);
        router.replace(HOME);
      } catch (e) {
        Alert.alert("Could not save", formatProfileApiError(e));
      } finally {
        setBusy(false);
      }
    })();
  };

  if (!session) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color="#165d75" size="large" />
      </View>
    );
  }

  return (
    <SaveDetailsArtboard keyboardShiftStyle={keyboardShiftStyle}>
      {avatarUrl ? (
        <View
          style={[
            styles.avatarRing,
            {
              left: SAVE_AVATAR_LEFT,
              top: SAVE_AVATAR_TOP,
              width: SAVE_AVATAR_SIZE,
              height: SAVE_AVATAR_SIZE,
            },
          ]}
        >
          <Image
            accessibilityLabel="Your profile avatar"
            source={{ uri: avatarUrl }}
            style={styles.avatarImage}
          />
        </View>
      ) : null}

      <SaveDetailsField
        accessibilityLabel="Your name"
        autoCapitalize="words"
        label="Your Name"
        onChangeText={setName}
        placeholder="Enter your name"
        top={saveDetailsFields.name}
        value={name}
      />

      <Text
        style={[styles.fieldLabel, { top: saveDetailsFields.phone.labelTop }]}
      >
        Mobile Number
      </Text>
      <View
        style={[styles.fieldShell, { top: saveDetailsFields.phone.shellTop }]}
      >
        <View style={styles.phoneRow}>
          <Text style={styles.phonePrefix}>+91</Text>
          <TextInput
            accessibilityLabel="Mobile number"
            editable={false}
            style={styles.phoneValue}
            value={phoneDisplay}
          />
        </View>
      </View>

      <SaveDetailsField
        accessibilityLabel="Email address"
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email Address"
        onChangeText={setEmail}
        placeholder="you@example.com"
        top={saveDetailsFields.email}
        value={email}
      />

      <SaveDetailsField
        accessibilityLabel="Address"
        label="Address"
        onChangeText={setAddress}
        placeholder="Your address"
        top={saveDetailsFields.address}
        value={address}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save profile details"
        accessibilityState={{ disabled: !canSave }}
        disabled={!canSave}
        onPress={onSave}
        style={[
          saveDetailsArtboardStyles.saveBtn,
          {
            left: SAVE_BTN_LEFT,
            top: SAVE_BTN_TOP,
            width: SAVE_BTN_W,
            height: SAVE_BTN_H,
          },
        ]}
      >
        {canSave ? (
          <LinearGradient
            colors={["#165d75", "#177ea1"]}
            end={{ x: 1, y: 0 }}
            pointerEvents="none"
            start={{ x: 0, y: 0 }}
            style={saveDetailsArtboardStyles.saveGradient}
          />
        ) : (
          <LinearGradient
            colors={["#a8bdc4", "#8faab4"]}
            end={{ x: 1, y: 0 }}
            pointerEvents="none"
            start={{ x: 0, y: 0 }}
            style={saveDetailsArtboardStyles.saveGradient}
          />
        )}
        <View
          pointerEvents="box-none"
          style={saveDetailsArtboardStyles.saveBtnForeground}
        >
          <Text style={saveDetailsArtboardStyles.saveText}>
            {busy ? "Saving..." : "Save"}
          </Text>
          <View
            collapsable={false}
            style={[
              saveDetailsArtboardStyles.saveArrowWrap,
              {
                left: SAVE_ARROW_FRAME_LEFT,
                top: SAVE_ARROW_TOP,
                width: SAVE_ARROW_FRAME,
                height: SAVE_ARROW_FRAME,
                opacity: busy ? 0 : 1,
              },
            ]}
          >
            <ArrowWithContinue
              height={SAVE_ARROW_FRAME}
              width={SAVE_ARROW_FRAME}
            />
          </View>
        </View>
        {busy ? (
          <View
            accessibilityElementsHidden
            pointerEvents="none"
            style={{
              ...saveDetailsArtboardStyles.saveBtnForeground,
              alignItems: "center",
            }}
          >
            <ActivityIndicator color="#ffffff" />
          </View>
        ) : null}
      </Pressable>
    </SaveDetailsArtboard>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fffdf8",
  },
  avatarRing: {
    position: "absolute",
    zIndex: 3,
    borderRadius: 999,
    borderWidth: 6,
    borderColor: "#fff",
    backgroundColor: "#e8e8e8",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  fieldLabel: {
    position: "absolute",
    left: SAVE_FIELD_LABEL_LEFT,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 40.374,
    lineHeight: 50.467,
    letterSpacing: -1.2617,
    color: "#2a2a2a",
    zIndex: 2,
  },
  fieldShell: {
    position: "absolute",
    left: SAVE_FIELD_SHELL_LEFT,
    width: SAVE_FIELD_SHELL_W,
    height: SAVE_FIELD_SHELL_H,
    borderRadius: 30.28,
    borderWidth: 5,
    borderColor: "#e1e1e1",
    backgroundColor: "#fffdf8",
    justifyContent: "center",
    paddingHorizontal: 36,
    zIndex: 2,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  phonePrefix: {
    fontFamily: "Poppins_500Medium",
    fontSize: 40.374,
    letterSpacing: -1.2617,
    color: "#1e1e1e",
    marginRight: 12,
  },
  phoneValue: {
    flex: 1,
    fontFamily: "Poppins_500Medium",
    fontSize: 40.374,
    letterSpacing: -1.2617,
    color: "#545454",
    paddingVertical: 0,
  },
});
