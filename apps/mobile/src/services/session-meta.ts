import * as SecureStore from "expo-secure-store";

const PROFILE_COMPLETE_KEY = "digital_advert.profile_complete";

export async function saveProfileCompleteFlag(complete: boolean): Promise<void> {
  await SecureStore.setItemAsync(PROFILE_COMPLETE_KEY, complete ? "1" : "0");
}

export async function loadProfileCompleteFlag(): Promise<boolean | null> {
  const raw = await SecureStore.getItemAsync(PROFILE_COMPLETE_KEY);
  if (raw === "1") return true;
  if (raw === "0") return false;
  return null;
}

export async function clearProfileCompleteFlag(): Promise<void> {
  await SecureStore.deleteItemAsync(PROFILE_COMPLETE_KEY);
}
