import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomNavbar, getBottomNavbarPillMetrics } from "@/src/components/bottom-navbar";
import { formatDisplayPhone } from "@/src/lib/format-display-phone";
import { formatHomeGreeting } from "@/src/lib/format-home-greeting";
import { CartBackground } from "@/src/screens/Cart/components/cart-background";
import { ProfileBottomDeco } from "@/src/screens/Profile/components/profile-bottom-deco";
import { ProfileLogoutButton } from "@/src/screens/Profile/components/profile-logout-button";
import { ProfileMenuRow } from "@/src/screens/Profile/components/profile-menu-row";
import { ProfileSectionTitle } from "@/src/screens/Profile/components/profile-section-title";
import { useAuthSession } from "@/src/stores/auth-session";
import { useCustomerProfile } from "@/src/stores/customer-profile";

const DESIGN_W = 1080;

const profileMenuIcons = {
  shoppingBag: require("@/assets/images/profile/shopping-bag.png"),
  map3d: require("@/assets/images/profile/map-3d.png"),
  helpCenter: require("@/assets/images/profile/help-center.png"),
  termsPrivacy: require("@/assets/images/profile/terms-privacy.png"),
} as const;

export default function ProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (v: number) => (v * width) / DESIGN_W;
  const signOut = useAuthSession((state) => state.signOut);

  const name = useCustomerProfile((state) => state.name);
  const avatarUrl = useCustomerProfile((state) => state.avatarUrl);
  const email = useCustomerProfile((state) => state.email);
  const phoneNumber = useCustomerProfile((state) => state.phoneNumber);
  const hydrated = useCustomerProfile((state) => state.hydrated);

  const greeting = formatHomeGreeting(name);
  const phoneDisplay = formatDisplayPhone(phoneNumber);
  const emailDisplay = email?.trim() || "Add your email";
  const nameDisplay = name?.trim() || "Your name";

  const padH = s(52);
  const { barH: navbarH } = getBottomNavbarPillMetrics(width, s);
  const navBottom = Math.max(insets.bottom, s(20));
  const scrollBottom = navBottom + navbarH + s(32);

  useEffect(() => {
    void useCustomerProfile.getState().refresh();
  }, []);

  const onEditProfile = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/edit-profile");
  }, [router]);

  const onLogout = useCallback(() => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          void (async () => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await signOut();
            router.replace("/(auth)/login");
          })();
        },
      },
    ]);
  }, [router, signOut]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fffdf8" , paddingTop: s(50)}}>
      <CartBackground s={s} width={width} />
      <ProfileBottomDeco s={s} width={width} />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + s(24),
          paddingHorizontal: padH,
          paddingBottom: scrollBottom,
          gap: s(28),
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: s(52),
            lineHeight: s(58),
            letterSpacing: s(-1.3),
            color: "#1e1e1e",
            textTransform: "capitalize",
            paddingBottom: s(20),
          }}
        >
          {greeting}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: s(20) }}>
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
              elevation: 2,
              borderCurve: "continuous",
            }}
          >
            {avatarUrl ? (
              <Image
                accessibilityLabel="Profile photo"
                source={{ uri: avatarUrl }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f3f0e8",
                }}
              >
                <Ionicons name="person" size={s(72)} color="#165d75" />
              </View>
            )}
          </View>

          <View style={{ flex: 1, paddingTop: s(8), gap: s(8), minWidth: 0 }}>
            {!hydrated ? (
              <ActivityIndicator color="#165d75" style={{ alignSelf: "flex-start" }} />
            ) : (
              <>
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: s(45),
                    lineHeight: s(52),
                    letterSpacing: s(-1.3),
                    color: "#1e1e1e",
                    textTransform: "capitalize",
                  }}
                >
                  {nameDisplay}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: s(24),
                    lineHeight: s(25),
                    letterSpacing: s(-1.5),
                    color: "#4a4a4a",
                  }}
                >
                  {emailDisplay}
                </Text>
                {phoneDisplay ? (
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: s(24),
                      lineHeight: s(28),
                      letterSpacing: s(-1.7),
                      color: "#4a4a4a",
                      textTransform: "uppercase",
                    }}
                  >
                    {phoneDisplay}
                  </Text>
                ) : null}
              </>
            )}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            hitSlop={8}
            onPress={onEditProfile}
            style={({ pressed }) => ({
              width: s(86),
              height: s(86),
              borderRadius: s(90),
              backgroundColor: "#fff8e5",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.88 : 1,
            })}
          >
            <Ionicons name="create-outline" size={s(42)} color="#c9a227" />
          </Pressable>
        </View>

        <View style={{ gap: s(16), marginTop: s(8) }}>
          <ProfileSectionTitle title="My Orders" s={s} />
          <ProfileMenuRow
            title="My Orders"
            subtitle="Track, manage and view your orders"
            icon={profileMenuIcons.shoppingBag}
            s={s}
            onPress={() => router.push("/my-orders")}
          />
        </View>

        <View style={{ gap: s(16) }}>
          <ProfileSectionTitle title="Addresses" s={s} />
          <ProfileMenuRow
            title="Saved Address"
            subtitle="Manage your saved addresses"
            icon={profileMenuIcons.map3d}
            s={s}
            onPress={() => router.push("/saved-address")}
          />
        </View>

        <View style={{ gap: s(16) }}>
          <ProfileSectionTitle title="Support & Legal" s={s} />
          <ProfileMenuRow
            title="Help Center"
            subtitle="Get help and support for your services"
            icon={profileMenuIcons.helpCenter}
            s={s}
            onPress={() => router.push("/help-center")}
          />
          <ProfileMenuRow
            title="Terms & Privacy"
            subtitle="Read our terms and privacy policy"
            icon={profileMenuIcons.termsPrivacy}
            s={s}
            onPress={() => router.push("/terms-privacy")}
          />
        </View>

        <ProfileLogoutButton onPress={onLogout} s={s} />
      </ScrollView>

      <BottomNavbar activeTab="profile" s={s} navBottom={navBottom} />
    </View>
  );
}
