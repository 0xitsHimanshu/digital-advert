import axios from "axios";
import { describe, expect, it, vi } from "vitest";

vi.mock("expo-secure-store", () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

vi.mock("@/src/services/auth-api", () => ({
  fetchCustomerProfileMe: vi.fn(),
  refreshCustomerSession: vi.fn(),
  isAuthHttpError: (e: unknown) =>
    axios.isAxiosError(e) &&
    (e.response?.status === 401 || e.response?.status === 403),
  isNetworkError: (e: unknown) => axios.isAxiosError(e) && e.response == null,
}));

vi.mock("@/src/services/onboarding-session", () => ({
  loadOnboardingSession: vi.fn(async () => null),
  saveOnboardingSession: vi.fn(async () => undefined),
  clearOnboardingSession: vi.fn(async () => undefined),
}));

vi.mock("@/src/services/session-meta", () => ({
  loadProfileCompleteFlag: vi.fn(async () => true),
  saveProfileCompleteFlag: vi.fn(async () => undefined),
  clearProfileCompleteFlag: vi.fn(async () => undefined),
}));

import {
  clearCustomerAuth,
  restoreCustomerSession,
  type SessionRestoreDeps,
} from "@/src/services/auth-session";

function createDeps(
  overrides: Partial<SessionRestoreDeps> = {}
): SessionRestoreDeps {
  return {
    loadSessionTokens: vi.fn(async () => ({
      accessToken: "access-valid",
      refreshToken: "refresh-valid",
    })),
    loadProfileCompleteFlag: vi.fn(async () => true),
    loadOnboardingSession: vi.fn(async () => null),
    saveTokens: vi.fn(async () => undefined),
    clearTokens: vi.fn(async () => undefined),
    clearOnboarding: vi.fn(async () => undefined),
    clearProfileFlag: vi.fn(async () => undefined),
    clearProfileCache: vi.fn(async () => undefined),
    cacheProfile: vi.fn(async () => undefined),
    saveOnboarding: vi.fn(async () => undefined),
    saveProfileFlag: vi.fn(async () => undefined),
    refreshSession: vi.fn(async () => ({
      accessToken: "access-new",
      refreshToken: "refresh-new",
    })),
    fetchProfile: vi.fn(async () => ({
      profileComplete: true,
      uid: "uid-1",
      phoneNumber: "+911234567890",
    })),
    isTokenExpired: vi.fn(() => false),
    ...overrides,
  };
}

describe("restoreCustomerSession", () => {
  it("uses the local profile flag fast path without network", async () => {
    const deps = createDeps();

    const result = await restoreCustomerSession(deps);

    expect(result).toEqual({ status: "authenticated", profileComplete: true });
    expect(deps.fetchProfile).not.toHaveBeenCalled();
    expect(deps.refreshSession).not.toHaveBeenCalled();
  });

  it("refreshes expired access tokens and keeps the session", async () => {
    const deps = createDeps({
      isTokenExpired: vi.fn((token) => token === "access-expired"),
      loadSessionTokens: vi.fn(async () => ({
        accessToken: "access-expired",
        refreshToken: "refresh-valid",
      })),
    });

    const result = await restoreCustomerSession(deps);

    expect(deps.refreshSession).toHaveBeenCalledWith("refresh-valid");
    expect(deps.saveTokens).toHaveBeenCalledWith("access-new", "refresh-new");
    expect(result).toEqual({ status: "authenticated", profileComplete: true });
  });

  it("clears stale auth when refresh token is invalid", async () => {
    const deps = createDeps({
      loadProfileCompleteFlag: vi.fn(async () => null),
      isTokenExpired: vi.fn(() => true),
      loadSessionTokens: vi.fn(async () => ({
        accessToken: "access-expired",
        refreshToken: "refresh-valid",
      })),
      refreshSession: vi.fn(async () => {
        throw new axios.AxiosError(
          "invalid refresh",
          "401",
          undefined,
          undefined,
          {
            status: 401,
            statusText: "Unauthorized",
            headers: {},
            config: { headers: {} } as never,
            data: { message: "invalid" },
          }
        );
      }),
    });

    const result = await restoreCustomerSession(deps);

    expect(result).toEqual({ status: "unauthenticated" });
    expect(deps.clearTokens).toHaveBeenCalled();
    expect(deps.clearOnboarding).toHaveBeenCalled();
    expect(deps.clearProfileFlag).toHaveBeenCalled();
    expect(deps.clearProfileCache).toHaveBeenCalled();
  });

  it("routes to login when no session exists", async () => {
    const deps = createDeps({
      loadSessionTokens: vi.fn(async () => ({
        accessToken: null,
        refreshToken: null,
      })),
    });

    const result = await restoreCustomerSession(deps);

    expect(result).toEqual({ status: "unauthenticated" });
    expect(deps.refreshSession).not.toHaveBeenCalled();
  });
});

describe("clearCustomerAuth", () => {
  it("clears tokens, onboarding, and profile flag on logout", async () => {
    const deps = createDeps();
    await clearCustomerAuth(deps);

    expect(deps.clearTokens).toHaveBeenCalled();
    expect(deps.clearOnboarding).toHaveBeenCalled();
    expect(deps.clearProfileFlag).toHaveBeenCalled();
    expect(deps.clearProfileCache).toHaveBeenCalled();
  });
});
