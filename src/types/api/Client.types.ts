export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type SearchParams = Record<string, string | number | boolean | null | undefined>;

export type ApiClientOptions = {
  /**
   * Attach `Authorization: Bearer <token>` from the session cookie.
   * Defaults to true (dashboard: almost every call is authenticated).
   * Set to false for public endpoints like login.
   */
  requiresAuth?: boolean;
  /**
   * Cache mode. Defaults to "no-store" — correct for a dashboard.
   * Ignored when `tags` or `revalidate` are provided.
   */
  cache?: RequestCache;
  /** Cache tags for on-demand revalidation. Only for public/cacheable data. */
  tags?: string[];
  /** ISR fallback window in seconds. Only for public/cacheable data. */
  revalidate?: number | false;
  /** Query string params; null/undefined entries are skipped. */
  searchParams?: SearchParams;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

export type ApiRequestOptions = ApiClientOptions & {
  method?: HttpMethod;
  /** FormData is sent as-is (multipart); any other value is JSON-stringified. */
  body?: FormData | unknown;
};
