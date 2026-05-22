import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { formatDisplayPhone } from "@/src/lib/format-display-phone";
import {
  formatProfileApiError,
  getCustomerProfile,
  saveCustomerProfile,
} from "@/src/services/profile-api";
import { CartBackground } from "@/src/screens/Cart/components/cart-background";
import { useCustomerProfile } from "@/src/stores/customer-profile";

const DESIGN_W = 1080;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EditProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (v: number) => (v * width) / DESIGN_W;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const profile = await getCustomerProfile();
        if (profile) {
          await useCustomerProfile.getState().setProfile(profile);
          setName(profile.name.trim());
          setEmail(profile.email?.trim() ?? "");
          setPhoneNumber(profile.phoneNumber);
          setAvatarUrl(profile.avatarUrl);
          setAddress(profile.address?.trim() ?? "");
        }
      } catch {
        const state = useCustomerProfile.getState();
        setName(state.name?.trim() ?? "");
        setEmail(state.email?.trim() ?? "");
        setPhoneNumber(state.phoneNumber);
        setAvatarUrl(state.avatarUrl);
        setAddress(state.address?.trim() ?? "");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const emailValid = !email.trim() || EMAIL_RE.test(email.trim());
  const canSave =
    !busy && name.trim().length > 0 && emailValid && Boolean(avatarUrl?.trim());

  const onSave = useCallback(() => {
    if (!canSave || !avatarUrl || !phoneNumber) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    void (async () => {
      setBusy(true);
      try {
        const profile = await saveCustomerProfile({
          name: name.trim(),
          phoneNumber,
          email: email.trim() || undefined,
          address: address.trim() || undefined,
          avatarUrl,
        });
        await useCustomerProfile.getState().setProfile(profile);
        router.back();
      } catch (e) {
        Alert.alert("Could not save", formatProfileApiError(e));
      } finally {
        setBusy(false);
      }
    })();
  }, [address, avatarUrl, canSave, email, name, phoneNumber, router]);

  const phoneDisplay = formatDisplayPhone(phoneNumber);

  return (
    <View style={{ flex: 1, backgroundColor: "#fffdf8" }}>
      <CartBackground s={s} width={width} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View
          style={{
            paddingTop: insets.top + s(24),
            paddingHorizontal: s(52),
            flexDirection: "row",
            alignItems: "center",
            gap: s(16),
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            onPress={() => router.back()}
            style={{
              width: s(72),
              height: s(72),
              borderRadius: s(36),
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: "#e0e0e0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="chevron-back" size={s(40)} color="#165d75" />
          </Pressable>
          <Text
            style={{
              flex: 1,
              fontFamily: "Poppins_500Medium",
              fontSize: s(42),
              color: "#1e1e1e",
              textTransform: "capitalize",
            }}
          >
            Edit Profile
          </Text>
        </View>

        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color="#165d75" size="large" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: s(52),
              paddingTop: s(24),
              paddingBottom: insets.bottom + s(40),
              gap: s(24),
              alignItems: "center",
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                width: s(195),
                height: s(185),
                borderRadius: s(50),
                borderWidth: s(5),
                borderColor: "#ffffff",
                backgroundColor: "#e8e8e8",
                overflow: "hidden",
                shadowColor: "#000000",
                shadowOffset: { width: s(3), height: s(4) },
                shadowOpacity: 0.04,
                shadowRadius: s(15),
              }}
            >
              {avatarUrl ? (
                <Image
                  accessibilityLabel="Profile photo"
                  source={{ uri: avatarUrl }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : null}
            </View>

            <ProfileField label="Your Name" s={s}>
              <TextInput
                accessibilityLabel="Your name"
                autoCapitalize="words"
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#a0a0a0"
                style={fieldInputStyle(s)}
                value={name}
              />
            </ProfileField>

            <ProfileField label="Mobile Number" s={s}>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: s(28),
                  color: "#545454",
                }}
              >
                {phoneDisplay || "—"}
              </Text>
            </ProfileField>

            <ProfileField label="Email Address" s={s}>
              <TextInput
                accessibilityLabel="Email address"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#a0a0a0"
                style={fieldInputStyle(s)}
                value={email}
              />
            </ProfileField>

            {!emailValid ? (
              <Text
                style={{
                  alignSelf: "stretch",
                  fontFamily: "Poppins_400Regular",
                  fontSize: s(22),
                  color: "#e05252",
                }}
              >
                Enter a valid email address.
              </Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save profile"
              accessibilityState={{ disabled: !canSave }}
              disabled={!canSave}
              onPress={onSave}
              style={({ pressed }) => ({
                alignSelf: "stretch",
                height: s(104),
                borderRadius: s(35),
                backgroundColor: canSave ? "#165d75" : "#a8bdc4",
                alignItems: "center",
                justifyContent: "center",
                marginTop: s(8),
                opacity: pressed && canSave ? 0.9 : 1,
              })}
            >
              {busy ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: s(32),
                    color: "#ffffff",
                  }}
                >
                  Save
                </Text>
              )}
            </Pressable>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

function ProfileField({
  label,
  children,
  s,
}: {
  label: string;
  children: ReactNode;
  s: (v: number) => number;
}) {
  return (
    <View style={{ alignSelf: "stretch", gap: s(10) }}>
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: s(28),
          color: "#2a2a2a",
        }}
      >
        {label}
      </Text>
      <View
        style={{
          borderRadius: s(30),
          borderWidth: s(3),
          borderColor: "#e1e1e1",
          backgroundColor: "#ffffff",
          paddingHorizontal: s(28),
          paddingVertical: s(18),
          justifyContent: "center",
        }}
      >
        {children}
      </View>
    </View>
  );
}

function fieldInputStyle(s: (v: number) => number) {
  return {
    fontFamily: "Poppins_400Regular" as const,
    fontSize: s(28),
    color: "#1e1e1e",
    paddingVertical: 0,
  };
}
