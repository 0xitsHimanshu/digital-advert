import { create } from "zustand";

import { logoutCustomer } from "@/src/services/auth-api";
import {
  clearCustomerAuth,
  restoreCustomerSession,
  type RestoreSessionResult,
} from "@/src/services/auth-session";
import { loadAccessToken } from "@/src/services/session-tokens";
import { useCustomerProfile } from "@/src/stores/customer-profile";

export type AuthBootstrapStatus = "bootstrapping" | "authenticated" | "unauthenticated";

type AuthSessionState = {
  status: AuthBootstrapStatus;
  profileComplete: boolean;
  bootstrap: () => Promise<RestoreSessionResult>;
  applyRestoreResult: (result: RestoreSessionResult) => void;
  markAuthenticated: (profileComplete: boolean) => void;
  signOut: () => Promise<void>;
};

let bootstrapPromise: Promise<RestoreSessionResult> | null = null;

export const useAuthSession = create<AuthSessionState>((set, get) => ({
  status: "bootstrapping",
  profileComplete: false,

  bootstrap: async (): Promise<RestoreSessionResult> => {
    const current = get();
    if (current.status === "authenticated") {
      return current.profileComplete
        ? { status: "authenticated", profileComplete: true }
        : {
            status: "authenticated",
            profileComplete: false,
            uid: "",
            phoneNumber: "",
          };
    }
    if (current.status === "unauthenticated") {
      return { status: "unauthenticated" };
    }

    if (!bootstrapPromise) {
      bootstrapPromise = restoreCustomerSession()
        .then((result) => {
          set({
            status:
              result.status === "authenticated" ? "authenticated" : "unauthenticated",
            profileComplete:
              result.status === "authenticated" ? result.profileComplete : false,
          });
          return result;
        })
        .finally(() => {
          bootstrapPromise = null;
        });
    }

    return bootstrapPromise;
  },

  applyRestoreResult: (result) => {
    set({
      status: result.status === "authenticated" ? "authenticated" : "unauthenticated",
      profileComplete:
        result.status === "authenticated" ? result.profileComplete : false,
    });
  },

  markAuthenticated: (profileComplete) => {
    set({ status: "authenticated", profileComplete });
  },

  signOut: async () => {
    const token = await loadAccessToken();
    if (token) {
      try {
        await logoutCustomer(token);
      } catch {
        // Best-effort server logout; always clear local session.
      }
    }
    await clearCustomerAuth();
    await useCustomerProfile.getState().clear();
    set({ status: "unauthenticated", profileComplete: false });
  },
}));
