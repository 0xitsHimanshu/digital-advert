"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";

import { adminSignIn, adminSignOut, subscribeAuth } from "@/lib/firebase/client";

type AdminAuthContextValue = {
  firebaseUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeAuth((user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const cred = await adminSignIn(email, password);
    const idToken = await cred.user.getIdToken();
    const res = await fetch("/api/admin/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      credentials: "same-origin",
    });
    if (!res.ok) {
      await adminSignOut();
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? "Admin login failed");
    }
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/admin/auth/logout", { method: "POST", credentials: "same-origin" });
    await adminSignOut();
  }, []);

  const value = useMemo(
    () => ({ firebaseUser, loading, signIn, signOut }),
    [firebaseUser, loading, signIn, signOut],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
