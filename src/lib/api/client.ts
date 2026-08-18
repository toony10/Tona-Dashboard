import { getAuthToken } from "@/lib/auth/get-auth-token";
import { getApiBaseUrl } from "./config";
import type { ApiResponse, RequestOptions } from "./types";

function isFormData(value: unknown): boolean {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

export async function apiClient<TData, TBody = unknown>(
  endpoint: string,
  options: RequestOptions<TBody> = {},
): Promise<ApiResponse<TData>> {
  const { method = "GET", body, tags, revalidate, cache } = options;

  const useFormData = body != null && isFormData(body);

  const headers: HeadersInit = {};
  if (!useFormData) {
    headers["Content-Type"] = "application/json";
  }

  const nextOptions: { tags?: string[]; revalidate?: number } = {};
  if (tags) nextOptions.tags = tags;
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;

  try {
    const token = await getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

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

    if (!res.ok) {
      if (!json) {
        return {
          success: false,
          statusCode: res.status,
          message: res.statusText,
          errors: [],
        };
      }

      return {
        success: json.success,
        statusCode: json.statusCode,
        message: json.message,
        errors: json.errors,
      };
    }

    if (!json) {
      return {
        success: false,
        statusCode: res.status,
        message: "Failed to parse response",
        errors: [],
      };
    }

    return json;
  } catch {
    return {
      success: false,
      statusCode: 0,
      message: "Network error",
      errors: ["Failed to connect to the server"],
    };
  }
}
