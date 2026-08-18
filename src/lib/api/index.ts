export { apiClient } from "./client";
export { getApiBaseUrl, getRefreshPath } from "./config";
export { clearAuthCookiesFromStore } from "@/lib/auth/clear-auth-cookies-from-store";
export { getAuthToken } from "@/lib/auth/get-auth-token";
export {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_FALLBACK_MAX_AGE,
  ACCESS_TOKEN_HEADER,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_FALLBACK_MAX_AGE,
  clearAuthCookies,
  getAuthCookieOptions,
  getJwtMaxAgeSeconds,
  isValidAccessToken,
  refreshTokens,
  setAuthCookies,
} from "@/lib/auth";
export type { ApiResponse, AuthTokens, HttpMethod, RequestOptions } from "./types";
