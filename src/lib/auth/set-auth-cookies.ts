import { getAuthCookieOptions } from "./auth-cookie-options";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_FALLBACK_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_FALLBACK_MAX_AGE,
} from "./constants";

type CookieStore = {
  set: (
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "lax" | "strict" | "none";
      path?: string;
      maxAge?: number;
    },
  ) => unknown;
};

export function setAuthCookies(
  cookieStore: CookieStore,
  accessToken: string,
  refreshToken: string,
) {
  cookieStore.set(
    ACCESS_TOKEN_COOKIE,
    accessToken,
    getAuthCookieOptions(accessToken, ACCESS_TOKEN_FALLBACK_MAX_AGE),
  );
  cookieStore.set(
    REFRESH_TOKEN_COOKIE,
    refreshToken,
    getAuthCookieOptions(refreshToken, REFRESH_TOKEN_FALLBACK_MAX_AGE),
  );
}
