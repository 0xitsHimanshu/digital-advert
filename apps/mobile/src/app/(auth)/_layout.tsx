import { Stack, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuthNavigationGuard } from "@/src/hooks/use-auth-navigation-guard";
import { useAuthSession } from "@/src/stores/auth-session";

function resolveAuthGuard(
  route: string | undefined
): "require-guest" | "require-incomplete-profile" | "none" {
  if (route === "save-details") return "require-incomplete-profile";
  if (route === "login" || route === "signup") return "require-guest";
  return "none";
}

export default function AuthLayout() {
  const segments = useSegments();
  const status = useAuthSession((s) => s.status);
  const route = segments[segments.length - 1];
  const guardMode = resolveAuthGuard(route);

  useAuthNavigationGuard(guardMode);

  if (status === "bootstrapping") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fffdf8" }}>
        <ActivityIndicator color="#165d75" size="large" />
      </View>
    );
  }

  if (guardMode === "require-guest" && status === "authenticated") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fffdf8" }}>
        <ActivityIndicator color="#165d75" size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
