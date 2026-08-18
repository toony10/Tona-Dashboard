import { getApiBaseUrl, getRefreshPath } from "@/lib/api/config";
import type { ApiResponse, AuthTokens } from "@/lib/api/types";

/**
 * Calls the backend refresh endpoint. Does not read or write cookies —
 * the caller persists the returned tokens.
 *
 * Uses plain `fetch`, never `apiClient`, so it cannot recurse.
 */
export async function refreshTokens(refreshToken: string): Promise<AuthTokens | null> {
  const response = await fetch(`${getApiBaseUrl()}/${getRefreshPath()}`, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
    headers: {
      "Content-Type": "application/json",
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
