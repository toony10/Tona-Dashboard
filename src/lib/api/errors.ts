/**
 * Normalized error thrown by the api client for any non-2xx response
 * (and for auth/network failures). Server actions catch this and map it
 * to a `MutationResult`; server components can let it bubble to `error.tsx`.
 */
export class ApiError extends Error {
  /** HTTP status code. 0 means the request never reached the server. */
  readonly status: number;
  /** Per-field validation errors, e.g. `{ email: ["Already taken"] }`. */
  readonly fieldErrors?: Record<string, string[]>;
  /** Raw response body, for cases the normalized fields don't cover. */
  readonly payload?: unknown;

  constructor(
    status: number,
    message: string,
    options?: { fieldErrors?: Record<string, string[]>; payload?: unknown },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = options?.fieldErrors;
    this.payload = options?.payload;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isValidationError(): boolean {
    return this.status === 422 || this.fieldErrors !== undefined;
  }
}

/**
 * Builds an ApiError from a failed response, tolerating the common backend
 * error shapes: `{ message }`, `{ error }`, `{ errors: { field: [...] } }`.
 */
export async function apiErrorFromResponse(response: Response): Promise<ApiError> {
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    // Non-JSON error body (HTML error page, empty body, etc.)
  }

  let message = response.statusText || `Request failed with status ${response.status}`;
  let fieldErrors: Record<string, string[]> | undefined;

  if (payload && typeof payload === "object") {
    const body = payload as Record<string, unknown>;

    if (typeof body.message === "string") message = body.message;
    else if (typeof body.error === "string") message = body.error;

    if (body.errors && typeof body.errors === "object" && !Array.isArray(body.errors)) {
      fieldErrors = body.errors as Record<string, string[]>;
    }
  }

  return new ApiError(response.status, message, { fieldErrors, payload });
}

/** Safe user-facing message from any thrown value. */
export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
