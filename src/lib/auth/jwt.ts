/**
 * JWT helpers for deriving cookie maxAge from token claims.
 * These decode the payload only — they do not verify signatures.
 */

import type { JwtPayload } from "@/types/auth";

/**
 * Decode a JWT payload without verification.
 * Returns null if the token is malformed.
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** Unix timestamp (seconds) of the JWT `exp` claim, or null if missing/invalid. */
export function getJwtExpiration(token: string): number | null {
  const exp = decodeJwtPayload(token)?.exp;
  return typeof exp === "number" && Number.isFinite(exp) ? exp : null;
}

/**
 * Seconds until the JWT expires (`exp - now`), or null if unavailable / already expired.
 */
export function getJwtMaxAge(token: string): number | null {
  const exp = getJwtExpiration(token);
  if (exp === null) return null;

  const maxAge = exp - Math.floor(Date.now() / 1000);
  return maxAge > 0 ? maxAge : null;
}

/**
 * Resolve cookie maxAge from an explicit `expiresIn` (seconds) or the JWT `exp` claim.
 * Returns undefined when neither source is usable (session cookie — no Max-Age).
 */
export function resolveTokenMaxAge(token: string, expiresIn?: number): number | undefined {
  if (typeof expiresIn === "number" && Number.isFinite(expiresIn) && expiresIn > 0) {
    return Math.floor(expiresIn);
  }

  return getJwtMaxAge(token) ?? undefined;
}
