import {
  LexendDeca_500Medium,
  LexendDeca_600SemiBold,
  useFonts as useLexendFonts,
} from "@expo-google-fonts/lexend-deca";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "@/src/lib/ensure-auth-bootstrap";
import { useAuthSession } from "@/src/stores/auth-session";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useLexendFonts({
    LexendDeca_500Medium,
    LexendDeca_600SemiBold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });
  const authStatus = useAuthSession((s) => s.status);
  const ready = fontsLoaded && authStatus !== "bootstrapping";

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ animation: "none" }} />
        <Stack.Screen name="start" options={{ animation: "fade" }} />
        <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        <Stack.Screen name="service/[id]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="checkout" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="edit-profile" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="saved-address" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="my-orders" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="order/[id]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="help-center" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="terms-privacy" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="(auth)" />
      </Stack>
    </SafeAreaProvider>
  );
}
