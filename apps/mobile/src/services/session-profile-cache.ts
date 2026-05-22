import * as SecureStore from "expo-secure-store";

const PROFILE_CACHE_KEY = "digital_advert.profile_cache";

export type CachedCustomerProfile = {
  name: string;
  avatarUrl?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
};

export async function saveCachedCustomerProfile(
  profile: CachedCustomerProfile
): Promise<void> {
  await SecureStore.setItemAsync(PROFILE_CACHE_KEY, JSON.stringify(profile));
}

export async function loadCachedCustomerProfile(): Promise<CachedCustomerProfile | null> {
  const raw = await SecureStore.getItemAsync(PROFILE_CACHE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CachedCustomerProfile;
    if (typeof parsed.name === "string" && parsed.name.trim()) {
      return {
        name: parsed.name.trim(),
        avatarUrl:
          typeof parsed.avatarUrl === "string" ? parsed.avatarUrl : undefined,
        email: typeof parsed.email === "string" ? parsed.email : undefined,
        phoneNumber:
          typeof parsed.phoneNumber === "string" ? parsed.phoneNumber : undefined,
        address: typeof parsed.address === "string" ? parsed.address : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function clearCachedCustomerProfile(): Promise<void> {
  await SecureStore.deleteItemAsync(PROFILE_CACHE_KEY);
}
