import "server-only";

import { clearAuthCookies, getAccessToken, refreshSession } from "@/lib/auth";
import type { ApiClientOptions, ApiRequestOptions, SearchParams } from "@/types/api";

import { getApiBaseUrl } from "./config";
import { ApiError, apiErrorFromResponse } from "./errors";

function buildUrl(endpoint: string, searchParams?: SearchParams): string {
  const url = new URL(`${getApiBaseUrl()}/${endpoint.replace(/^\/+/, "")}`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== null && value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function buildHeaders(
  options: ApiRequestOptions,
  isJsonBody: boolean,
  accessToken?: string,
): Headers {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  // FormData must NOT get an explicit Content-Type: fetch sets the
  // multipart boundary automatically.
  if (isJsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

/**
 * Next.js rejects conflicting options (e.g. `revalidate` + `no-store`),
 * so exactly one strategy is applied:
 * - `tags`/`revalidate` provided -> cached fetch with on-demand invalidation
 * - otherwise -> `cache` option, defaulting to "no-store"
 */
function cacheOptions(options: ApiRequestOptions): Pick<RequestInit, "cache"> & {
  next?: { tags?: string[]; revalidate?: number | false };
} {
  if (options.tags || options.revalidate !== undefined) {
    return { next: { tags: options.tags, revalidate: options.revalidate } };
  }

  return { cache: options.cache ?? "no-store" };
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}

/**
 * Performs a single fetch — no auth resolution, no retry. FormData bodies
 * are re-serializable, so the same options can safely be executed twice
 * (initial attempt + post-refresh retry).
 */
async function executeRequest(
  endpoint: string,
  options: ApiRequestOptions,
  accessToken?: string,
): Promise<Response> {
  const { method = "GET", body, signal } = options;
  const isFormData = body instanceof FormData;
  const hasBody = body !== undefined && body !== null;
  const isJsonBody = hasBody && !isFormData;

  try {
    return await fetch(buildUrl(endpoint, options.searchParams), {
      method,
      headers: buildHeaders(options, isJsonBody, accessToken),
      signal,
      body: isFormData ? body : isJsonBody ? JSON.stringify(body) : undefined,
      ...cacheOptions(options),
    });
  } catch (error) {
    // Network failure, DNS error, abort — the request never got a response.
    throw new ApiError(0, error instanceof Error ? error.message : "Network error", {
      payload: error,
    });
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw await apiErrorFromResponse(response);
  }

  return parseResponse<T>(response);
}

/**
 * Core request function. Server-side only (server components, server
 * actions, route handlers) — importing it from client code fails at build
 * time via "server-only".
 *
 * Auth flow: on a 401 from an authenticated request, the session is
 * refreshed (deduplicated across concurrent callers) and the request is
 * retried exactly once. Any other status — 403, 404, 422, 500, and a 401
 * on the retry itself — throws `ApiError` immediately.
 *
 * This client never writes cookies. Cookie storage lives in the auth module
 * / route handlers; here we only read the access token and orchestrate retry.
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const requiresAuth = options.requiresAuth ?? true;
  let accessToken: string | undefined;

  if (requiresAuth) {
    accessToken = await getAccessToken();

    // Access cookie expired/missing but a refresh token may still exist —
    // recover the session before failing.
    if (!accessToken) {
      const refreshed = await refreshSession();
      accessToken = refreshed ? await getAccessToken() : undefined;
    }

    if (!accessToken) {
      await clearAuthCookies();
      throw new ApiError(401, "Not authenticated");
    }
  }

  const response = await executeRequest(endpoint, options, accessToken);

  if (response.status !== 401 || !requiresAuth) {
    return handleResponse<T>(response);
  }

  // 401 on an authenticated request: refresh once, retry once.
  const refreshed = await refreshSession();

  if (!refreshed) {
    await clearAuthCookies();
    throw new ApiError(401, "Not authenticated");
  }

  const newAccessToken = await getAccessToken();

  if (!newAccessToken) {
    await clearAuthCookies();
    throw new ApiError(401, "Not authenticated");
  }

  // Terminal: whatever the retry returns is final — no second refresh.
  return handleResponse<T>(await executeRequest(endpoint, options, newAccessToken));
}

/** Verb helpers — the preferred way to call the API. */
export const api = {
  get: <T>(endpoint: string, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: FormData | unknown, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(endpoint: string, body?: FormData | unknown, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(endpoint: string, body?: FormData | unknown, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};
