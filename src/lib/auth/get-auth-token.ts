import "server-only";

import { cookies, headers } from "next/headers";

import { clearAuthCookies } from "./clear-auth-cookies";
import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_HEADER, REFRESH_TOKEN_COOKIE } from "./constants";
import { isValidAccessToken } from "./is-valid-access-token";
import { refreshTokens } from "./refresh-tokens";
import { setAuthCookies } from "./set-auth-cookies";

export async function getAuthToken(): Promise<string | null> {
  const headerList = await headers();
  const headerToken = headerList.get(ACCESS_TOKEN_HEADER) ?? undefined;
  if (isValidAccessToken(headerToken)) return headerToken!;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (isValidAccessToken(accessToken)) return accessToken!;
  if (!refreshToken) return null;

  // Document requests: proxy already refreshed or redirected. Refreshing here
  // during RSC render cannot persist cookies (`cookies().set` throws).
  // Server Actions (`next-action`) may still refresh as a fallback.
  if (!headerList.has("next-action")) {
    return null;
  }

  const tokens = await refreshTokens(refreshToken);

  if (!tokens) {
    clearAuthCookies(cookieStore);
    return null;
  }

  setAuthCookies(cookieStore, tokens.accessToken, tokens.refreshToken);
  return tokens.accessToken;
}
