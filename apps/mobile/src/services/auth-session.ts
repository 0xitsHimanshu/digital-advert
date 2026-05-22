import { getJwtPhoneNumber, getJwtSubject, isJwtExpired } from "@/src/lib/jwt";
import {
  fetchCustomerProfileMe,
  isAuthHttpError,
  isNetworkError,
  refreshCustomerSession,
} from "@/src/services/auth-api";
import {
  clearOnboardingSession,
  loadOnboardingSession,
  saveOnboardingSession,
} from "@/src/services/onboarding-session";
import {
  clearProfileCompleteFlag,
  loadProfileCompleteFlag,
  saveProfileCompleteFlag,
} from "@/src/services/session-meta";
import {
  clearCachedCustomerProfile,
  saveCachedCustomerProfile,
} from "@/src/services/session-profile-cache";
import {
  clearCustomerSessionTokens,
  loadSessionTokens,
  saveCustomerSessionTokens,
} from "@/src/services/session-tokens";

export type RestoreSessionResult =
  | { status: "authenticated"; profileComplete: true }
  | {
      status: "authenticated";
      profileComplete: false;
      uid: string;
      phoneNumber: string;
    }
  | { status: "unauthenticated" };

export type SessionRestoreDeps = {
  loadSessionTokens: () => Promise<{
    accessToken: string | null;
    refreshToken: string | null;
  }>;
  loadProfileCompleteFlag: () => Promise<boolean | null>;
  loadOnboardingSession: () => Promise<{
    uid: string;
    phoneNumber: string;
  } | null>;
  saveTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  clearTokens: () => Promise<void>;
  clearOnboarding: () => Promise<void>;
  clearProfileFlag: () => Promise<void>;
  clearProfileCache: () => Promise<void>;
  saveOnboarding: (session: { uid: string; phoneNumber: string }) => Promise<void>;
  saveProfileFlag: (complete: boolean) => Promise<void>;
  refreshSession: (refreshToken: string) => Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  fetchProfile: (accessToken: string) => Promise<{
    profileComplete: boolean;
    uid: string;
    phoneNumber: string;
    name: string;
    avatarUrl: string;
  }>;
  cacheProfile: (profile: { name: string; avatarUrl?: string }) => Promise<void>;
  isTokenExpired: (token: string) => boolean;
};

const defaultDeps: SessionRestoreDeps = {
  loadSessionTokens,
  loadProfileCompleteFlag,
  loadOnboardingSession,
  saveTokens: saveCustomerSessionTokens,
  clearTokens: clearCustomerSessionTokens,
  clearOnboarding: clearOnboardingSession,
  clearProfileFlag: clearProfileCompleteFlag,
  clearProfileCache: clearCachedCustomerProfile,
  saveOnboarding: saveOnboardingSession,
  saveProfileFlag: saveProfileCompleteFlag,
  cacheProfile: saveCachedCustomerProfile,
  refreshSession: async (refreshToken) => {
    const data = await refreshCustomerSession(refreshToken);
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  },
  fetchProfile: async (accessToken) => {
    const data = await fetchCustomerProfileMe(accessToken);
    return {
      profileComplete: data.profileComplete,
      uid: data.profile?.uid ?? "",
      phoneNumber: data.profile?.phoneNumber ?? "",
      name: data.profile?.name ?? "",
      avatarUrl: data.profile?.avatarUrl ?? "",
    };
  },
  isTokenExpired: isJwtExpired,
};

export async function clearCustomerAuth(
  deps: Pick<
    SessionRestoreDeps,
    "clearTokens" | "clearOnboarding" | "clearProfileFlag" | "clearProfileCache"
  > = defaultDeps
): Promise<void> {
  await Promise.all([
    deps.clearTokens(),
    deps.clearOnboarding(),
    deps.clearProfileFlag(),
    deps.clearProfileCache(),
  ]);
}

function resolveOnboardingIdentity(
  accessToken: string,
  onboarding: { uid: string; phoneNumber: string } | null
): { uid: string; phoneNumber: string } {
  return {
    uid: onboarding?.uid || getJwtSubject(accessToken) || "",
    phoneNumber:
      onboarding?.phoneNumber || getJwtPhoneNumber(accessToken) || "",
  };
}

async function ensureValidAccessToken(
  deps: SessionRestoreDeps,
  tokens: { accessToken: string | null; refreshToken: string | null }
): Promise<string | null> {
  let { accessToken, refreshToken } = tokens;

  if (!accessToken && !refreshToken) {
    return null;
  }

  if (accessToken && !deps.isTokenExpired(accessToken)) {
    return accessToken;
  }

  if (!refreshToken) {
    await clearCustomerAuth(deps);
    return null;
  }

  try {
    const refreshed = await deps.refreshSession(refreshToken);
    await deps.saveTokens(refreshed.accessToken, refreshed.refreshToken);
    return refreshed.accessToken;
  } catch (e) {
    if (isAuthHttpError(e)) {
      await clearCustomerAuth(deps);
      return null;
    }
    if (isNetworkError(e) && accessToken && !deps.isTokenExpired(accessToken)) {
      return accessToken;
    }
    throw e;
  }
}

function fastPathRestore(
  accessToken: string,
  profileFlag: boolean | null,
  onboarding: { uid: string; phoneNumber: string } | null,
  deps: SessionRestoreDeps
): RestoreSessionResult | null {
  if (profileFlag === true) {
    return { status: "authenticated", profileComplete: true };
  }

  if (profileFlag === false) {
    const { uid, phoneNumber } = resolveOnboardingIdentity(accessToken, onboarding);
    if (uid && phoneNumber) {
      return {
        status: "authenticated",
        profileComplete: false,
        uid,
        phoneNumber,
      };
    }
  }

  return null;
}

export async function restoreCustomerSession(
  deps: SessionRestoreDeps = defaultDeps
): Promise<RestoreSessionResult> {
  const [tokens, profileFlag, onboarding] = await Promise.all([
    deps.loadSessionTokens(),
    deps.loadProfileCompleteFlag(),
    deps.loadOnboardingSession(),
  ]);

  if (!tokens.accessToken && !tokens.refreshToken) {
    return { status: "unauthenticated" };
  }

  if (
    tokens.accessToken &&
    !deps.isTokenExpired(tokens.accessToken)
  ) {
    const fast = fastPathRestore(tokens.accessToken, profileFlag, onboarding, deps);
    if (fast) return fast;
  }

  let accessToken: string | null;
  try {
    accessToken = await ensureValidAccessToken(deps, tokens);
  } catch {
    return { status: "unauthenticated" };
  }

  if (!accessToken) {
    return { status: "unauthenticated" };
  }

  if (!deps.isTokenExpired(accessToken)) {
    const fast = fastPathRestore(accessToken, profileFlag, onboarding, deps);
    if (fast) {
      if (fast.profileComplete) {
        await deps.clearOnboarding();
      }
      return fast;
    }
  }

  try {
    const profile = await deps.fetchProfile(accessToken);
    await deps.saveProfileFlag(profile.profileComplete);

    if (!profile.profileComplete) {
      const { uid, phoneNumber } = resolveOnboardingIdentity(
        accessToken,
        onboarding?.uid
          ? onboarding
          : profile.uid
            ? { uid: profile.uid, phoneNumber: profile.phoneNumber }
            : null
      );
      if (uid && phoneNumber) {
        await deps.saveOnboarding({ uid, phoneNumber });
        return {
          status: "authenticated",
          profileComplete: false,
          uid,
          phoneNumber,
        };
      }
      await clearCustomerAuth(deps);
      return { status: "unauthenticated" };
    }

    await deps.clearOnboarding();
    if (profile.name) {
      await deps.cacheProfile({
        name: profile.name,
        ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}),
      });
    }
    return { status: "authenticated", profileComplete: true };
  } catch (e) {
    if (isAuthHttpError(e)) {
      await clearCustomerAuth(deps);
      return { status: "unauthenticated" };
    }
    if (isNetworkError(e)) {
      const optimistic =
        profileFlag === true
          ? { status: "authenticated" as const, profileComplete: true as const }
          : fastPathRestore(accessToken, profileFlag, onboarding, deps);
      if (optimistic) return optimistic;
      return { status: "authenticated", profileComplete: true };
    }
    await clearCustomerAuth(deps);
    return { status: "unauthenticated" };
  }
}
