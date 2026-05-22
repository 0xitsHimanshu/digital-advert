/** Reads JWT `exp` (seconds) without verifying the signature — client-side expiry hint only. */
export function getJwtExpiryMs(token: string): number | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

/** True when the token is missing/invalid or past expiry (30s skew). */
export function isJwtExpired(token: string, nowMs = Date.now()): boolean {
  const expMs = getJwtExpiryMs(token);
  if (expMs == null) return true;
  return nowMs >= expMs - 30_000;
}

export function getJwtSubject(token: string): string | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded)) as { sub?: unknown };
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export function getJwtPhoneNumber(token: string): string | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded)) as { phone_number?: unknown };
    return typeof payload.phone_number === "string" ? payload.phone_number : null;
  } catch {
    return null;
  }
}
