import { describe, expect, it } from "vitest";

import { getJwtExpiryMs, isJwtExpired } from "@/src/lib/jwt";

function makeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.sig`;
}

describe("jwt helpers", () => {
  it("detects expired access tokens with skew", () => {
    const expired = makeJwt({ exp: Math.floor(Date.now() / 1000) - 120 });
    expect(isJwtExpired(expired)).toBe(true);
  });

  it("treats valid tokens as not expired", () => {
    const valid = makeJwt({ exp: Math.floor(Date.now() / 1000) + 3600 });
    expect(isJwtExpired(valid)).toBe(false);
    expect(getJwtExpiryMs(valid)).not.toBeNull();
  });
});
