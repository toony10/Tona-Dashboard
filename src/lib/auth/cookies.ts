import "server-only";

import { cookies } from "next/headers";

import type { AuthTokens } from "@/types/auth";

import { resolveTokenMaxAge } from "./jwt";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

/**
 * In-request access-token overrides keyed by refresh token.
 * Used when `cookies().set()` is unavailable (Server Component render):
 * the rotated access token is still available for the same-request retry.
 */
const accessTokenOverrides = new Map<string, string>();

function cookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(maxAge !== undefined ? { maxAge } : {}),
  };
}

/**
 * Best-effort cookie write. `cookies().set()` only works in Server Actions
 * and Route Handlers; during Server Component rendering it throws.
 */
async function writeCookie(name: string, value: string, maxAge?: number): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(name, value, cookieOptions(maxAge));
  } catch {
    // Server Component render context — cannot mutate response cookies here.
  }
}

async function deleteCookie(name: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(name, "", { ...cookieOptions(), maxAge: 0 });
  } catch {
    // Same constraint as writeCookie.
  }
}

export function isAuthTokens(value: unknown): value is AuthTokens {
  if (!value || typeof value !== "object") return false;
  const body = value as Record<string, unknown>;
  return typeof body.accessToken === "string" && typeof body.refreshToken === "string";
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (fromCookie) return fromCookie;

  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  if (refreshToken) {
    return accessTokenOverrides.get(refreshToken);
  }

  return undefined;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}

export async function setAccessToken(token: string, expiresIn?: number): Promise<void> {
  await writeCookie(ACCESS_TOKEN_COOKIE, token, resolveTokenMaxAge(token, expiresIn));
}

export async function setRefreshToken(token: string, expiresIn?: number): Promise<void> {
  await writeCookie(REFRESH_TOKEN_COOKIE, token, resolveTokenMaxAge(token, expiresIn));
}

/**
 * Store both auth cookies and remember the access token for same-request retries.
 * This is the only persistence entry point used by auth route handlers / refresh.
 *
 * When cookie writes are unavailable (Server Component render), overrides are
 * keyed by both the previous and new refresh token so `getAccessToken()` still
 * resolves for the same-request retry.
 */
export async function persistAuthTokens(
  tokens: AuthTokens,
  previousRefreshToken?: string,
): Promise<void> {
  accessTokenOverrides.set(tokens.refreshToken, tokens.accessToken);

  if (previousRefreshToken && previousRefreshToken !== tokens.refreshToken) {
    accessTokenOverrides.set(previousRefreshToken, tokens.accessToken);
  }

  await setAccessToken(tokens.accessToken, tokens.expiresIn);
  await setRefreshToken(tokens.refreshToken, tokens.refreshExpiresIn);
}

export async function clearAuthCookies(): Promise<void> {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    accessTokenOverrides.delete(refreshToken);
  }

  await deleteCookie(ACCESS_TOKEN_COOKIE);
  await deleteCookie(REFRESH_TOKEN_COOKIE);
}
