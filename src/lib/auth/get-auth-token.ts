import "server-only";

import { cookies, headers } from "next/headers";

import { clearAuthCookies } from "./clear-auth-cookies";
import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_HEADER, REFRESH_TOKEN_COOKIE } from "./constants";
import { isValidAccessToken } from "./is-valid-access-token";
import { refreshTokens } from "./refresh-tokens";
import { setAuthCookies } from "./set-auth-cookies";

export async function getAuthToken(): Promise<string | null> {
  const headerToken = (await headers()).get(ACCESS_TOKEN_HEADER) ?? undefined;
  if (isValidAccessToken(headerToken)) return headerToken!;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (isValidAccessToken(accessToken)) return accessToken!;

  if (!refreshToken) return null;

  const tokens = await refreshTokens(refreshToken);

  if (!tokens) {
    clearAuthCookies(cookieStore);
    return null;
  }

  try {
    setAuthCookies(cookieStore, tokens.accessToken, tokens.refreshToken);
  } catch {
    // `cookies().set()` is not allowed during Server Component render.
    // The new access token is still returned for this request.
  }

  return tokens.accessToken;
}
