import "server-only";

import { endInvalidSession } from "@/lib/auth/end-invalid-session";
import { getAuthToken } from "@/lib/auth/get-auth-token";
import { refreshAndPersist } from "@/lib/auth/refresh-and-persist";
import { getApiBaseUrl } from "./config";
import type { ApiResponse, RequestOptions } from "./types";

function isFormData(value: unknown): boolean {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

function isNextControlFlowError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("digest" in error)) {
    return false;
  }

  const digest = String((error as { digest?: unknown }).digest);
  return digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND");
}

function toErrorResponse<TData>(
  statusCode: number,
  message: string,
  errors: string[] = [],
): ApiResponse<TData> {
  return {
    success: false,
    statusCode,
    message,
    errors,
  };
}

async function send<TData, TBody>(
  endpoint: string,
  options: RequestOptions<TBody>,
  token: string | null,
): Promise<{ status: number; statusText: string; json: ApiResponse<TData> | null }> {
  const { method = "GET", body, tags, revalidate, cache } = options;
  const useFormData = body != null && isFormData(body);

  const headers: HeadersInit = {};
  if (!useFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const nextOptions: { tags?: string[]; revalidate?: number } = {};
  if (tags) nextOptions.tags = tags;
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;

  const res = await fetch(`${getApiBaseUrl()}/${endpoint.replace(/^\/+/, "")}`, {
    method,
    headers,
    body:
      body == null
        ? undefined
        : useFormData
          ? (body as unknown as FormData)
          : JSON.stringify(body),
    cache: cache ?? "no-store",
    next: nextOptions,
  } as RequestInit);

  const json: ApiResponse<TData> | null = await res.json().catch(() => null);
  return { status: res.status, statusText: res.statusText, json };
}

function fromHttp<TData>(
  status: number,
  statusText: string,
  json: ApiResponse<TData> | null,
): ApiResponse<TData> {
  if (status >= 200 && status < 300) {
    return json ?? toErrorResponse(status, "Failed to parse response");
  }

  if (!json) {
    return toErrorResponse(status, statusText);
  }

  return {
    success: json.success,
    statusCode: json.statusCode,
    message: json.message,
    errors: json.errors,
  };
}

export async function apiClient<TData, TBody = unknown>(
  endpoint: string,
  options: RequestOptions<TBody> = {},
): Promise<ApiResponse<TData>> {
  return requestWithAuth(endpoint, options, { retryOnUnauthorized: true });
}

async function requestWithAuth<TData, TBody>(
  endpoint: string,
  options: RequestOptions<TBody>,
  state: { retryOnUnauthorized: boolean; token?: string | null },
): Promise<ApiResponse<TData>> {
  try {
    const token = state.token !== undefined ? state.token : await getAuthToken();
    const { status, statusText, json } = await send<TData, TBody>(
      endpoint,
      options,
      token,
    );

    if (status === 401 && token) {
      if (state.retryOnUnauthorized) {
        const nextToken = await refreshAndPersist();
        if (nextToken) {
          return requestWithAuth(endpoint, options, {
            retryOnUnauthorized: false,
            token: nextToken,
          });
        }
      }

      await endInvalidSession();
    }

    return fromHttp(status, statusText, json);
  } catch (error) {
    if (isNextControlFlowError(error)) {
      throw error;
    }

    return toErrorResponse(0, "Network error", ["Failed to connect to the server"]);
  }
}
