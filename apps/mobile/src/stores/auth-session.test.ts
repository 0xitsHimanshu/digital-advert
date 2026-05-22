import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/src/services/auth-session", () => ({
  restoreCustomerSession: vi.fn(),
  clearCustomerAuth: vi.fn(async () => undefined),
}));

vi.mock("@/src/services/auth-api", () => ({
  logoutCustomer: vi.fn(async () => undefined),
}));

vi.mock("@/src/services/session-tokens", () => ({
  loadAccessToken: vi.fn(async () => "token"),
}));

vi.mock("@/src/stores/customer-profile", () => ({
  useCustomerProfile: {
    getState: () => ({
      clear: vi.fn(async () => undefined),
    }),
  },
}));

import { clearCustomerAuth, restoreCustomerSession } from "@/src/services/auth-session";
import { useAuthSession } from "@/src/stores/auth-session";

describe("useAuthSession store", () => {
  beforeEach(() => {
    useAuthSession.setState({
      status: "bootstrapping",
      profileComplete: false,
    });
    vi.mocked(restoreCustomerSession).mockReset();
    vi.mocked(clearCustomerAuth).mockReset();
  });

  it("marks authenticated after bootstrap with a valid session", async () => {
    vi.mocked(restoreCustomerSession).mockResolvedValue({
      status: "authenticated",
      profileComplete: true,
    });

    await useAuthSession.getState().bootstrap();

    expect(useAuthSession.getState().status).toBe("authenticated");
    expect(useAuthSession.getState().profileComplete).toBe(true);
  });

  it("signOut clears session and prevents dashboard access", async () => {
    useAuthSession.setState({ status: "authenticated", profileComplete: true });

    await useAuthSession.getState().signOut();

    expect(clearCustomerAuth).toHaveBeenCalled();
    expect(useAuthSession.getState().status).toBe("unauthenticated");
    expect(useAuthSession.getState().profileComplete).toBe(false);
  });
});
