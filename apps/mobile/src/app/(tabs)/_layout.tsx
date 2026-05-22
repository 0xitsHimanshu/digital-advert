import { Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuthNavigationGuard } from "@/src/hooks/use-auth-navigation-guard";
import { useAuthSession } from "@/src/stores/auth-session";

export default function TabsLayout() {
  useAuthNavigationGuard("require-auth");
  const status = useAuthSession((s) => s.status);

  if (status === "bootstrapping" || status === "unauthenticated") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fffdf8" }}>
        <ActivityIndicator color="#165d75" size="large" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="home-tab" />
      <Tabs.Screen name="search-tab" />
      <Tabs.Screen name="cart-tab" />
      <Tabs.Screen name="profile-tab" />
    </Tabs>
  );
}
