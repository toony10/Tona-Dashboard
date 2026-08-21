export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

/** Forwarded by proxy after a silent refresh so the current request can use the new token. */
export const ACCESS_TOKEN_HEADER = "x-access-token";

/** Proxy-only path that clears auth cookies then redirects to login. */
export const LOGOUT_PATH = "/logout";

/** Used only when the JWT `exp` claim cannot be decoded. */
export const ACCESS_TOKEN_FALLBACK_MAX_AGE = 60 * 15;
export const REFRESH_TOKEN_FALLBACK_MAX_AGE = 60 * 60 * 24 * 7;

export function isLogoutPath(pathname: string) {
  return pathname === LOGOUT_PATH || pathname.startsWith(`${LOGOUT_PATH}/`);
}
