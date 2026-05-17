import Constants from "expo-constants";
import { Platform } from "react-native";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * On the Android emulator, `localhost` is the emulator itself — not the dev
 * machine. Rewrite to the standard host loopback alias so Metro/API calls
 * reach the server running on your PC.
 */
function resolveHostForPlatform(url: string): string {
  if (Platform.OS !== "android") return url;

  // Emulator: 10.0.2.2 → host machine
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    return url.replace(/localhost|127\.0\.0\.1/g, "10.0.2.2");
  }

  return url;
}

/**
 * API base URL for the Digital Advert Express server.
 * Configure `expo.extra.apiUrl` in app config, or set EXPO_PUBLIC_API_URL.
 *
 * Physical device: set EXPO_PUBLIC_API_URL to your PC's LAN IP, e.g.
 * http://192.168.1.39:4000 (same Wi‑Fi as the phone).
 */
export function getApiBaseUrl(): string {
  const fromEnv =
    typeof process.env.EXPO_PUBLIC_API_URL === "string"
      ? process.env.EXPO_PUBLIC_API_URL.trim()
      : "";
  if (fromEnv) return resolveHostForPlatform(stripTrailingSlash(fromEnv));

  const fromExtra = Constants.expoConfig?.extra?.apiUrl;
  if (typeof fromExtra === "string" && fromExtra.trim())
    return resolveHostForPlatform(stripTrailingSlash(fromExtra.trim()));

  return resolveHostForPlatform("http://localhost:4000");
}
