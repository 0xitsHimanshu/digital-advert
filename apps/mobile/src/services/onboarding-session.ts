import * as SecureStore from "expo-secure-store";

const KEY = "digital_advert.onboarding_session";

export type OnboardingSession = {
  uid: string;
  phoneNumber: string;
};

export async function saveOnboardingSession(
  session: OnboardingSession
): Promise<void> {
  await SecureStore.setItemAsync(KEY, JSON.stringify(session));
}

export async function loadOnboardingSession(): Promise<OnboardingSession | null> {
  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as OnboardingSession;
    if (
      typeof parsed.uid === "string" &&
      typeof parsed.phoneNumber === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export async function clearOnboardingSession(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY);
}
