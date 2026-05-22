import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "digital_advert.access_token";
const REFRESH_KEY = "digital_advert.refresh_token";

export type StoredSessionTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

export async function loadSessionTokens(): Promise<StoredSessionTokens> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_KEY),
    SecureStore.getItemAsync(REFRESH_KEY),
  ]);
  return { accessToken, refreshToken };
}

export async function saveCustomerSessionTokens(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_KEY, accessToken),
    SecureStore.setItemAsync(REFRESH_KEY, refreshToken),
  ]);
}

export async function saveAccessToken(accessToken: string): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
}

export async function clearCustomerSessionTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
  ]);
}

export async function loadAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_KEY);
}

export async function loadRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_KEY);
}
