import { Redirect, type Href } from "expo-router";

import { useAuthSession } from "@/src/stores/auth-session";

const HOME = "/(tabs)/home-tab" as Href;
const SAVE_DETAILS = "/(auth)/save-details" as Href;
const LOGIN = "/(auth)/login" as Href;

export default function Index() {
  const status = useAuthSession((s) => s.status);
  const profileComplete = useAuthSession((s) => s.profileComplete);

  if (status === "bootstrapping") {
    return null;
  }

  if (status === "authenticated") {
    return <Redirect href={profileComplete ? HOME : SAVE_DETAILS} />;
  }

  return <Redirect href={LOGIN} />;
}
