/** Client-safe Firebase web config from env */
export function getFirebaseClientConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!apiKey || !authDomain || !projectId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? undefined,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? undefined,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? undefined,
  };
}

export const ADMIN_SESSION_COOKIE =
  process.env.ADMIN_SESSION_COOKIE_NAME ?? "__admin_session";

export const ADMIN_SESSION_EXPIRES_MS =
  Number(process.env.ADMIN_SESSION_EXPIRES_DAYS ?? "5") * 24 * 60 * 60 * 1000;

export const CART_ABANDONMENT_HOURS = Number(
  process.env.ADMIN_CART_ABANDONMENT_HOURS ?? "24",
);
