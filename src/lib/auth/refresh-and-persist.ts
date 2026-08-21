import "server-only";

import { cookies } from "next/headers";

import { REFRESH_TOKEN_COOKIE } from "./constants";
import { refreshTokens } from "./refresh-tokens";
import { setAuthCookies } from "./set-auth-cookies";

/**
 * Force-refresh using the refresh cookie, ignoring whether the access cookie
 * still looks unexpired. Used after a backend 401 (revocation, clock skew).
 *
 * Returns the new access token, or `null` if refresh is impossible.
 * Cookie writes are skipped during RSC render (`cookies().set` throws).
 */
export async function refreshAndPersist(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) return null;

  const tokens = await refreshTokens(refreshToken);
  if (!tokens) return null;

  try {
    setAuthCookies(cookieStore, tokens.accessToken, tokens.refreshToken);
  } catch {
    // RSC cannot persist cookies; the caller still retries with this token.
  }

  return tokens.accessToken;
}
