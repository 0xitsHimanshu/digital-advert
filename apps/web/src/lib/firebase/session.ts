import { cookies } from "next/headers";

import type { AdminUser } from "@/lib/types/admin";

import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_EXPIRES_MS } from "./config";
import { getAdminAuth, getAdminFirestore } from "./admin";

export type VerifiedAdminSession = {
  uid: string;
  email: string;
  admin: AdminUser;
};

/** Canonical collection; `admin` (singular) is accepted for backwards compatibility. */
const ADMINS_COLLECTIONS = ["admins", "admin"] as const;

async function getAdminDoc(uid: string) {
  const db = getAdminFirestore();
  for (const name of ADMINS_COLLECTIONS) {
    const snap = await db.collection(name).doc(uid).get();
    if (snap.exists) return snap;
  }
  return null;
}

/** Verify httpOnly session cookie and ensure user is in `admins` collection. */
export async function verifyAdminSession(): Promise<VerifiedAdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifySessionCookie(sessionCookie, true);

    const adminSnap = await getAdminDoc(decoded.uid);
    if (!adminSnap) return null;

    const data = adminSnap.data();
    if (!data || data.active === false) return null;

    const admin: AdminUser = {
      uid: decoded.uid,
      email: typeof data.email === "string" ? data.email : decoded.email ?? "",
      role: data.role === "super_admin" ? "super_admin" : "admin",
      displayName: typeof data.displayName === "string" ? data.displayName : undefined,
      active: true,
      createdAt:
        typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    };

    return {
      uid: decoded.uid,
      email: admin.email,
      admin,
    };
  } catch {
    return null;
  }
}

/** Create a Firebase session cookie from a client ID token (login). */
export async function createAdminSessionCookie(idToken: string): Promise<string> {
  const auth = getAdminAuth();
  const decoded = await auth.verifyIdToken(idToken);

  const adminSnap = await getAdminDoc(decoded.uid);
  if (!adminSnap) {
    throw new Error("FORBIDDEN");
  }

  const data = adminSnap.data();
  if (data?.active === false) {
    throw new Error("FORBIDDEN");
  }

  return auth.createSessionCookie(idToken, {
    expiresIn: ADMIN_SESSION_EXPIRES_MS,
  });
}

export function sessionCookieOptions() {
  return {
    name: ADMIN_SESSION_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(ADMIN_SESSION_EXPIRES_MS / 1000),
  };
}
