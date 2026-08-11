# API Reference: API Client

Server-only HTTP client for communicating with the backend API. It centralizes base URL resolution, authentication headers, automatic session refresh, caching semantics, body serialization (JSON and `FormData`), and error normalization — so pages, server actions, and route handlers never call `fetch` directly against the backend (except the dedicated auth routes).

## Files

| File | Responsibility |
|------|----------------|
| `src/lib/api/client.ts` | Core `apiClient()` function, `api` verb helpers, request execution, 401 retry orchestration |
| `src/lib/api/errors.ts` | `ApiError` class, backend error normalization, `getErrorMessage()` helper |
| `src/lib/api/config.ts` | Base URL resolution (`getApiBaseUrl()`) |
| `src/lib/api/index.ts` | Barrel export — always import from `@/lib/api` |
| `src/lib/auth/cookies.ts` | httpOnly cookie helpers (`set` / `get` / `clear` / `persistAuthTokens`) |
| `src/lib/auth/jwt.ts` | JWT `exp` / `expiresIn` → cookie `maxAge` helpers |
| `src/lib/auth/refresh.ts` | `refreshSession()`, concurrent-refresh deduplication |
| `src/types/api/` | API client option types (`Client.types.ts`) |
| `src/types/auth/` | Auth / JWT types (`Auth.types.ts`, `Jwt.types.ts`) |
| `src/app/api/auth/*/route.ts` | Login / refresh / logout route handlers (own cookie storage) |

## Server-only guarantee

`client.ts` and the auth module begin with `import "server-only"`. Importing them (directly or transitively) from a client component fails **at build time** with a clear error. This is intentional:

- The access token lives in an **httpOnly cookie** and must never reach the browser bundle.
- `API_URL` is a server-side environment variable (no `NEXT_PUBLIC_` prefix), so the backend origin is never exposed to the client.

Client components never fetch the backend directly. They call **server actions** or the Next.js auth route handlers (`/api/auth/*`).

---

## Environment setup

The client reads the backend origin from `API_URL`:

```bash
# .env.local (see .env.example)
API_URL=http://localhost:8000/api
```

- Include the path prefix (e.g. `/api`) if the backend uses one.
- Trailing slashes are stripped automatically.
- If `API_URL` is missing, the first request throws with a descriptive message. The check happens at request time (not import time) so builds don't fail on machines without an env file.

## Configuration (`config.ts`)

| Export | Purpose |
|--------|---------|
| `getApiBaseUrl()` | Returns `API_URL` with trailing slashes stripped; throws if unset |

Cookie names and JWT helpers live in `@/lib/auth`, not in the API client config.

---

## Public API

### Verb helpers (preferred)

```ts
import { api } from "@/lib/api";

api.get<T>(endpoint, options?)
api.post<T>(endpoint, body?, options?)
api.put<T>(endpoint, body?, options?)
api.patch<T>(endpoint, body?, options?)
api.delete<T>(endpoint, options?)
```

All helpers delegate to `apiClient<T>()` and share the same options and behavior. `T` is the type of the parsed response body.

### `apiClient<T>(endpoint, options?)`

The core function. Use it directly only when you need to set `method` dynamically; otherwise prefer the verb helpers.

### Options (`ApiClientOptions`)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `requiresAuth` | `boolean` | `true` | Attach `Authorization: Bearer <access_token>` from the session cookie. Set to `false` for public endpoints (login, register, forgot-password). |
| `cache` | `RequestCache` | `"no-store"` | Next.js fetch cache mode. The dashboard default is `no-store` — authenticated data must never be cached. Ignored when `tags` or `revalidate` are set. |
| `tags` | `string[]` | — | Cache tags for on-demand invalidation via `revalidateTag()`. Only for public/cacheable data (website apps) — never combine with authenticated fetches. |
| `revalidate` | `number \| false` | — | ISR fallback window in seconds. Same restriction as `tags`. |
| `searchParams` | `Record<string, string \| number \| boolean \| null \| undefined>` | — | Appended to the URL as a query string. Entries that are `null`, `undefined`, or `""` are skipped — pass raw filter values without cleaning them first. |
| `headers` | `HeadersInit` | — | Extra request headers. Merged before the defaults, so you can override `Accept` or `Content-Type` if needed. |
| `signal` | `AbortSignal` | — | Standard abort/timeout support, passed straight to `fetch`. |
| `method` | `"GET" \| "POST" \| "PUT" \| "PATCH" \| "DELETE"` | `"GET"` | Set automatically by the verb helpers. |
| `body` | `FormData \| unknown` | — | See [Body serialization](#body-serialization). |

### Endpoint format

Pass paths relative to `API_URL`, with or without a leading slash — both `"products"` and `"/products"` resolve to `<API_URL>/products`.

---

## Body serialization

The `body` option accepts two kinds of values:

1. **`FormData`** — sent as-is (`multipart/form-data`). The client deliberately does **not** set a `Content-Type` header: `fetch` generates the multipart boundary automatically, and setting the header manually would break the upload. Use this for anything containing files.
2. **Anything else (non-null)** — `JSON.stringify`-ed and sent with `Content-Type: application/json`.

`undefined`/`null` bodies send no payload.

```ts
// JSON
await api.post<Product>("products", { name: "Desk", price: 199 });

// Multipart with files — pass the FormData from a server action straight through
await api.post<Product>("products", formData);
```

`FormData` bodies are re-serializable, which is what makes the automatic 401 retry safe: the same body can be sent twice without being "consumed".

---

## Caching behavior

Next.js rejects conflicting cache options (e.g. `revalidate` together with `cache: "no-store"`), so the client applies **exactly one strategy** per request:

1. If `tags` or `revalidate` is provided → cached fetch: `{ next: { tags, revalidate } }`.
2. Otherwise → `{ cache }`, defaulting to `"no-store"`.

Rules of thumb (see the project caching conventions):

- **Dashboard data (authenticated)** → always the default `no-store`. Don't pass `tags` or `revalidate`.
- **Public/cacheable data** (only relevant if this client is reused in a public website app) → `tags` for on-demand invalidation, `revalidate` as a fallback window.
- **Never** combine `requiresAuth: true` with cached fetches — cached authenticated responses can leak one user's data to another.

---

## Response parsing

| Response | Result |
|----------|--------|
| `204 No Content` | `undefined` (type it as `api.delete<void>(...)`) |
| `Content-Type: application/json` | Parsed JSON, typed as `T` |
| Anything else | Raw text |
| Non-2xx status | Throws `ApiError` (see below) |
| Network/DNS failure, abort | Throws `ApiError` with `status: 0` |

---

## Error handling (`errors.ts`)

Every failure surfaces as a single normalized type: **`ApiError`**.

### `ApiError`

| Property | Type | Meaning |
|----------|------|---------|
| `status` | `number` | HTTP status code. `0` means the request never reached the server (network failure, DNS error, abort). |
| `message` | `string` | Human-readable message extracted from the response body, falling back to the status text. |
| `fieldErrors` | `Record<string, string[]> \| undefined` | Per-field validation errors, e.g. `{ email: ["Already taken"] }`. |
| `payload` | `unknown` | The raw response body, for anything the normalized fields don't cover. |

Convenience getters: `isUnauthorized` (401), `isForbidden` (403), `isNotFound` (404), `isValidationError` (422 or `fieldErrors` present).

### Backend error shape tolerance

`apiErrorFromResponse()` extracts a message from any of the common backend conventions, in order of precedence:

```json
{ "message": "Product not found" }
{ "error": "Product not found" }
{ "errors": { "name": ["Required"], "price": ["Must be positive"] } }
```

Non-JSON error bodies (HTML error pages, empty bodies) are tolerated — the status text is used instead.

### `getErrorMessage(error, fallback?)`

Returns a safe, user-facing string from **any** thrown value. Use it in `catch` blocks for toast messages and `MutationResult.message`:

```ts
catch (error) {
  return { success: false, message: getErrorMessage(error) };
}
```

### Where errors go

- **Server actions** — catch `ApiError` and map it to the `MutationResult` shape (`message` + field `errors`) that dialogs and forms consume.
- **Server components** — usually let the error bubble to the route's `error.tsx` boundary. Catch selectively (e.g. `isNotFound` → call `notFound()`).

---

## Authentication architecture

Responsibilities are split so the API client never writes cookies:

| Layer | Owns |
|-------|------|
| `src/app/api/auth/*/route.ts` | Browser-facing auth entry points; call the backend and persist tokens |
| `src/lib/auth/cookies.ts` | Cookie names, options, `maxAge` resolution, read/write helpers |
| `src/lib/auth/jwt.ts` | Decode JWT `exp` / prefer `expiresIn` for `maxAge` |
| `src/lib/auth/refresh.ts` | Backend refresh call + concurrency dedupe (`refreshSession`) |
| `src/lib/api/client.ts` | Headers, fetch, parse, 401 → refresh → retry once |

### Cookie model

| Cookie | Lifetime | Purpose |
|--------|----------|---------|
| `access_token` | From JWT `exp` or `expiresIn` | Sent as `Authorization: Bearer <token>` on every authenticated request |
| `refresh_token` | From JWT `exp` or `refreshExpiresIn` | Used only against `POST auth/refresh` to obtain new tokens |

Both are **httpOnly**, `sameSite=lax`, and `secure` in production. `maxAge` is derived automatically — never hardcoded.

### Auth route handlers

| Route | Backend call | Cookie effect |
|-------|--------------|---------------|
| `POST /api/auth/login` | `POST <API_URL>/auth/login` | Sets `access_token` + `refresh_token` |
| `POST /api/auth/refresh` | via `refreshSession()` | Rotates both cookies |
| `POST /api/auth/logout` | `POST <API_URL>/auth/logout` (best-effort) | Clears both cookies |

Backend token response shape:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 900,
  "refreshExpiresIn": 604800
}
```

`expiresIn` / `refreshExpiresIn` are optional. When omitted, cookie `maxAge` is taken from each token's JWT `exp` claim.

### Request lifecycle with refresh

```text
apiClient(endpoint, { requiresAuth: true })
  │
  ├─ getAccessToken()
  │    └─ missing? → refreshSession() → still nothing? → clear cookies → throw ApiError(401)
  │
  ├─ execute request with Bearer token
  │
  ├─ status ≠ 401 → parse response / throw ApiError   (403, 404, 422, 500 NEVER refresh)
  │
  └─ status = 401
       ├─ refreshSession()
       │    ├─ fails → clear cookies → throw ApiError(401)
       │    └─ succeeds → getAccessToken() → retry the request ONCE
       └─ retry result is final: 2xx → parsed data, anything else → ApiError
```

Guarantees:

- **Only 401 triggers a refresh.** Every other status throws immediately.
- **At most one retry per request.** The retry's response is handled terminally — a second 401 throws. Infinite loops are structurally impossible.
- **Unauthenticated requests (`requiresAuth: false`) never refresh.** A 401 from the login endpoint is a wrong-credentials error, not an expired session.
- **The refresh endpoint itself is called with plain `fetch`** inside `refresh.ts`, not through `apiClient`, so it can never recurse.
- **The API client never writes cookies.** Persistence goes through `cookies.ts` (used by auth routes and `refreshSession`).

### Concurrency: one refresh for many callers

When a page fires several authenticated requests in parallel and the access token has just expired, all of them receive 401 at roughly the same time.

`refreshSession()` deduplicates: in-flight refreshes are stored in a module-level `Map` keyed by the **refresh token value**. The first caller starts the actual HTTP call; every concurrent caller with the same session awaits the same promise. When it settles, the entry is removed and all callers retry with the same new access token.

The map is keyed by token — not a single global promise — because on the server, module state is shared across **all users'** requests. A global would let one user's refresh resolve another user's session.

### Cookie writes and Server Component rendering

Next.js only allows writing cookies in **Server Actions and Route Handlers**. During Server Component *rendering*, `cookies().set()` throws. Cookie helpers best-effort persist and also keep an in-request access-token override so the same-request retry still has a bearer token. The next mutation/navigation that can write cookies will persist them.

**Operational consequence:** if the backend uses strictly one-time-use rotating refresh tokens, a refresh that happens during component rendering "spends" the old token without saving the new one, killing the session on the next request. The backend should allow refresh-token reuse within a small grace window (30–60 seconds). Alternatively, move refresh into `middleware.ts`, which can write cookies on every request.

### `refreshSession()` as a standalone export

```ts
import { refreshSession } from "@/lib/auth";

const ok = await refreshSession(); // Promise<boolean>
```

Returns `true` on success, `false` if the session cannot be refreshed (no refresh token, backend rejection, or network failure). It never throws. On auth failure from the backend it clears cookies.

---

## Usage examples

### Fetching in a server component

```tsx
import { api } from "@/lib/api";

type Paginated<T> = { data: T[]; total: number; page: number };

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const { page, search } = await searchParams;

  const products = await api.get<Paginated<Product>>("products", {
    searchParams: { page, search, limit: 10 }, // undefined entries are skipped
  });

  return <ProductsTable data={products.data} total={products.total} />;
}
```

### Server action — JSON mutation

```ts
"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError, getErrorMessage } from "@/lib/api";

export async function updateProductAction(
  _prev: MutationResult | null,
  formData: FormData,
): Promise<MutationResult> {
  const id = String(formData.get("productId") ?? "").trim();
  if (!id) return { success: false, message: "Product is required" };

  try {
    const product = await api.patch<Product>(`products/${id}`, {
      name: formData.get("name"),
      price: Number(formData.get("price")),
    });

    revalidatePath("/products");
    return { success: true, data: product };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
      errors: error instanceof ApiError ? error.fieldErrors : undefined,
    };
  }
}
```

### Server action — file upload (FormData passthrough)

```ts
"use server";

export async function createProductAction(
  _prev: MutationResult | null,
  formData: FormData, // includes <input type="file" name="image" />
): Promise<MutationResult> {
  try {
    // Sent as multipart/form-data; files included, boundary handled by fetch
    const product = await api.post<Product>("products", formData);

    revalidatePath("/products");
    return { success: true, data: product };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}
```

### Browser login via route handler

```ts
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

### Public backend endpoint (no auth)

```ts
const result = await api.post<SomePublicResponse>("public/ping", null, {
  requiresAuth: false,
});
```

### Delete with no response body

```ts
await api.delete<void>(`products/${id}`); // 204 → resolves to undefined
```

### Handling not-found in a detail page

```ts
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";

async function getProduct(id: string) {
  try {
    return await api.get<Product>(`products/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error; // everything else bubbles to error.tsx
  }
}
```

### Abort / timeout

```ts
const data = await api.get<Report>("reports/heavy", {
  signal: AbortSignal.timeout(15_000),
});
```

---

## Design decisions

- **Native `fetch`, not Axios.** Next.js extends the native `fetch` with its Data Cache (`tags`, `revalidate`, `cache`); requests through Axios are invisible to that machinery, and Axios adds bundle weight with no benefit on the server.
- **`requiresAuth` defaults to `true`.** In a dashboard, nearly every call is authenticated. Public endpoints opt out explicitly, which is safer than the reverse.
- **Errors are thrown, not returned.** Server components want throw-to-boundary semantics; server actions convert to `MutationResult` at the edge. A single throwing convention keeps call sites clean.
- **Auth is modular.** Cookie storage, JWT maxAge, refresh, and HTTP retry each live in their own file. The API client never knows how cookies are stored — it only calls `getAccessToken()` / `refreshSession()` / `clearAuthCookies()`.

## Troubleshooting

| Symptom | Likely cause |
|---------|--------------|
| `Missing API_URL environment variable` | No `.env.local` — copy `.env.example` and set the backend URL |
| Build error: `server-only cannot be imported from a Client Component` | A `"use client"` file imports `@/lib/api` or `@/lib/auth` — move the call into a server action / route handler |
| `ApiError` with `status: 0` | Network-level failure: backend down, wrong `API_URL`, DNS, or aborted request |
| `ApiError(401, "Not authenticated")` | No access **and** no usable refresh token — user must log in |
| Session dies right after a refresh | Backend uses one-time-use refresh tokens and the refresh happened during component rendering (cookies not writable there) — add a reuse grace window on the backend or move refresh to middleware |
| Stale data on a dashboard page | A `cache`/`tags`/`revalidate` option was passed on authenticated data — remove it; dashboard fetches must stay `no-store` |
