import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

import {
  formatProfileApiError,
  getCustomerProfile,
  saveCustomerProfile,
} from "@/src/services/profile-api";
import { CartBackground } from "@/src/screens/Cart/components/cart-background";
import { useCustomerProfile } from "@/src/stores/customer-profile";

const DESIGN_W = 1080;

export default function SavedAddressScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (v: number) => (v * width) / DESIGN_W;

  const cachedAddress = useCustomerProfile((state) => state.address);
  const name = useCustomerProfile((state) => state.name);
  const avatarUrl = useCustomerProfile((state) => state.avatarUrl);
  const email = useCustomerProfile((state) => state.email);
  const phoneNumber = useCustomerProfile((state) => state.phoneNumber);

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
          setAddress(profile.address?.trim() ?? "");
        } else {
          setAddress(cachedAddress?.trim() ?? "");
        }
      } catch {
        setAddress(cachedAddress?.trim() ?? "");
      } finally {
        setLoading(false);
      }
    })();
  }, [cachedAddress]);

  const canSave =
    !busy &&
    Boolean(name?.trim()) &&
    Boolean(phoneNumber?.trim()) &&
    Boolean(avatarUrl?.trim()) &&
    address.trim().length > 0;

  const onSave = useCallback(() => {
    if (!canSave || !name || !phoneNumber || !avatarUrl) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    void (async () => {
      setBusy(true);
      try {
        const profile = await saveCustomerProfile({
          name: name.trim(),
          phoneNumber,
          email: email?.trim() || undefined,
          address: address.trim(),
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
            Saved Address
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
              paddingTop: s(32),
              paddingBottom: insets.bottom + s(40),
              gap: s(24),
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: s(24),
                lineHeight: s(34),
                color: "#919191",
              }}
            >
              {address.trim()
                ? "Update your delivery address below."
                : "Add an address for faster checkout and service delivery."}
            </Text>

            {address.trim() ? (
              <View
                style={{
                  borderRadius: s(32),
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  backgroundColor: "#ffffff",
                  paddingHorizontal: s(28),
                  paddingVertical: s(22),
                  gap: s(8),
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: s(26),
                    color: "#1e1e1e",
                  }}
                >
                  Current address
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: s(24),
                    lineHeight: s(34),
                    color: "#4a4a4a",
                  }}
                >
                  {address.trim()}
                </Text>
              </View>
            ) : null}

            <View
              style={{
                borderRadius: s(32),
                borderWidth: s(3),
                borderColor: "#e1e1e1",
                backgroundColor: "#ffffff",
                paddingHorizontal: s(28),
                paddingVertical: s(20),
                minHeight: s(200),
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: s(28),
                  color: "#2a2a2a",
                  marginBottom: s(12),
                }}
              >
                Address
              </Text>
              <TextInput
                accessibilityLabel="Saved address"
                multiline
                onChangeText={setAddress}
                placeholder="Street, area, city, pin code"
                placeholderTextColor="#a0a0a0"
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: s(28),
                  lineHeight: s(38),
                  color: "#1e1e1e",
                  minHeight: s(120),
                  textAlignVertical: "top",
                }}
                value={address}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save address"
              accessibilityState={{ disabled: !canSave }}
              disabled={!canSave}
              onPress={onSave}
              style={({ pressed }) => ({
                height: s(104),
                borderRadius: s(35),
                backgroundColor: canSave ? "#165d75" : "#a8bdc4",
                alignItems: "center",
                justifyContent: "center",
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
                  Save Address
                </Text>
              )}
            </Pressable>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
