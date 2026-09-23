import { getApiBaseUrl, getRefreshPath } from "@/lib/api/config";
import type { ApiResponse, AuthTokens } from "@/lib/api/types";

/**
 * Calls `auth/token/refresh` with no body. The refresh token is sent only as
 * `Authorization: Bearer {refreshToken}`. Does not read or write cookies —
 * the caller persists the returned tokens.
 *
 * Uses plain `fetch`, never `apiClient`, so it cannot recurse.
 */
export async function refreshTokens(refreshToken: string): Promise<AuthTokens | null> {
  const response = await fetch(`${getApiBaseUrl()}/${getRefreshPath()}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const body = (await response.json().catch(() => null)) as ApiResponse<AuthTokens> | null;
  const accessToken = body?.data?.accessToken;
  const newRefreshToken = body?.data?.refreshToken;

  if (!accessToken || !newRefreshToken) return null;

  return { accessToken, refreshToken: newRefreshToken };
}
