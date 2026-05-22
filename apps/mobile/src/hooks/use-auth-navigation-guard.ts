import { useRouter, type Href } from "expo-router";
import { useEffect } from "react";

import { useAuthSession } from "@/src/stores/auth-session";

const HOME = "/(tabs)/home-tab" as Href;
const LOGIN = "/(auth)/login" as Href;
const SAVE_DETAILS = "/(auth)/save-details" as Href;

type GuardMode =
  | "require-auth"
  | "require-guest"
  | "require-incomplete-profile"
  | "none";

export function useAuthNavigationGuard(mode: GuardMode) {
  const router = useRouter();
  const status = useAuthSession((s) => s.status);
  const profileComplete = useAuthSession((s) => s.profileComplete);

  useEffect(() => {
    if (mode === "none" || status === "bootstrapping") return;

    if (mode === "require-auth") {
      if (status !== "authenticated") {
        router.replace(LOGIN);
        return;
      }
      if (!profileComplete) {
        router.replace(SAVE_DETAILS);
      }
      return;
    }

    if (mode === "require-incomplete-profile") {
      if (status !== "authenticated") {
        router.replace(LOGIN);
        return;
      }
      if (profileComplete) {
        router.replace(HOME);
      }
      return;
    }

    if (status === "authenticated") {
      router.replace(profileComplete ? HOME : SAVE_DETAILS);
    }
  }, [mode, profileComplete, router, status]);
}
