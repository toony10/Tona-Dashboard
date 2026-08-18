/**
 * API base URL. Prefer `NEXT_PUBLIC_API_BASE_URL` (same as teacher-platform);
 * `API_URL` is accepted as a fallback.
 */
export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_URL;

  if (!baseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_BASE_URL (or API_URL) environment variable.",
    );
  }

  return baseUrl.replace(/\/+$/, "");
}

/** Refresh path relative to the API base. Override per app via `API_REFRESH_PATH`. */
export function getRefreshPath(): string {
  return (process.env.API_REFRESH_PATH ?? "auth/refresh").replace(/^\/+|\/+$/g, "");
}
