import "server-only";

import { getApiBaseUrl } from "@/lib/api/config";

import {
  clearAuthCookies,
  getRefreshToken,
  isAuthTokens,
  persistAuthTokens,
} from "./cookies";

/**
 * In-flight refresh calls, keyed by refresh token. Concurrent 401s with the
 * same session await one shared refresh. Keyed by token (not a global) because
 * module state is shared across all users on the server.
 */
const inFlightRefreshes = new Map<string, Promise<boolean>>();

async function executeRefresh(refreshToken: string): Promise<boolean> {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
  } catch {
    // Network failure — leave existing cookies; caller will surface 401.
    return false;
  }

  if (!response.ok) {
    await clearAuthCookies();
    return false;
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    await clearAuthCookies();
    return false;
  }

  if (!isAuthTokens(payload)) {
    await clearAuthCookies();
    return false;
  }

  await persistAuthTokens(payload, refreshToken);
  return true;
}

/**
 * Refreshes the session via POST /auth/refresh using the refresh_token cookie.
 * Returns true on success, false if the session cannot be refreshed.
 *
 * Owns refresh logic only — cookie writes go through `cookies.ts` helpers.
 * Concurrency-safe: simultaneous callers with the same refresh token share
 * a single in-flight request.
 *
 * Called with plain `fetch`, never through `apiClient`, so it cannot recurse.
 */
export async function refreshSession(): Promise<boolean> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  const existing = inFlightRefreshes.get(refreshToken);
  if (existing) {
    return existing;
  }

  const refresh = executeRefresh(refreshToken).finally(() => {
    inFlightRefreshes.delete(refreshToken);
  });

  inFlightRefreshes.set(refreshToken, refresh);
  return refresh;
}
