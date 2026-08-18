# API Reference: API Client and Auth

Server-only HTTP client and session layer for the dashboard. It centralizes base URL resolution, Bearer auth, silent token refresh, and a consistent `ApiResponse` shape — so pages, server actions, and route handlers never call `fetch` against the backend except `refreshTokens` (plain `fetch` on purpose).

`apiClient` **never throws** for HTTP or JSON errors. Callers check `response.success`.

## Files

| File | Responsibility |
|------|----------------|
| `src/lib/api/client.ts` | `apiClient()` — attach token, fetch, return `ApiResponse` |
| `src/lib/api/config.ts` | `getApiBaseUrl()`, `getRefreshPath()` |
| `src/lib/api/types.ts` | `ApiResponse`, `RequestOptions`, `AuthTokens` |
| `src/lib/api/index.ts` | Server barrel — import this from Server Components, actions, and route handlers |
| `src/lib/auth/index.ts` | **Edge-safe** barrel for `proxy.ts` (no `server-only`, no `cookies()` from `next/headers`) |
| `src/lib/auth/get-auth-token.ts` | Server-only: resolve access token (header → cookie → refresh) |
| `src/lib/auth/refresh-tokens.ts` | `POST` refresh endpoint only; does not read or write cookies |
| `src/lib/auth/set-auth-cookies.ts` / `clear-auth-cookies.ts` | Write/delete on a store you pass in |
| `src/lib/auth/clear-auth-cookies-from-store.ts` | Server-only shortcut: `cookies()` then delete |
| `src/proxy.ts` | Silent refresh + `x-access-token` forwarding on navigations |
| `src/app/api/auth/*/route.ts` | Login / refresh / logout route handlers |

`proxy.ts` **must** import from `@/lib/auth`. Importing `@/lib/api` loads `getAuthToken` (`server-only` + `next/headers`), which Edge middleware cannot use.

## Server-only guarantee

`get-auth-token.ts` and `clear-auth-cookies-from-store.ts` begin with `import "server-only"`. Importing `@/lib/api` (directly or transitively) from a client component fails **at build time**. This is intentional: the access token lives in an httpOnly cookie and must never reach the browser bundle.

Client components never fetch the backend directly. They call **server actions** or the Next.js auth route handlers (`/api/auth/*`).

---

## Environment

Set these in `.env.local` (see `.env.example`):

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | yes* | — | Backend origin, no trailing slash |
| `API_URL` | fallback | — | Used if `NEXT_PUBLIC_API_BASE_URL` is missing |
| `API_REFRESH_PATH` | no | `auth/refresh` | Path under the base URL (no leading slash) |

\* One of `NEXT_PUBLIC_API_BASE_URL` or `API_URL` must be set. `getApiBaseUrl()` throws if both are missing.

Trailing slashes on the base URL and leading/trailing slashes on the refresh path are stripped automatically.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
API_URL=http://localhost:8000/api
# API_REFRESH_PATH=auth/refresh
```

---

## Backend response contract

Every call, including refresh, is expected to look like:

```ts
interface ApiResponse<TData = null> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: TData;
  errors?: string[];
}
```

Network failure (fetch threw):

```ts
{ success: false, statusCode: 0, message: "Network error", errors: ["Failed to connect to the server"] }
```

Non-JSON error body:

```ts
{ success: false, statusCode: <http>, message: <statusText>, errors: [] }
```

Refresh tokens are read from **`data`**, not the top level:

```ts
type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

// POST {API}/auth/refresh
// body: { refreshToken: string }
// 200: { success, statusCode, message, data: { accessToken, refreshToken } }
```

If `success` is true but `data.accessToken` / `data.refreshToken` are missing, refresh is treated as failure (`null`).

---

## `apiClient`

```ts
import { apiClient } from "@/lib/api";
import type { ApiResponse } from "@/lib/api";

const res = await apiClient<School[]>("schools");
if (!res.success) {
  // res.message, res.errors, res.statusCode
  return;
}
const schools = res.data;
```

Signature:

```ts
apiClient<TData, TBody = unknown>(
  endpoint: string,
  options?: RequestOptions<TBody>,
): Promise<ApiResponse<TData>>
```

`RequestOptions`:

| Option | Default | Notes |
|---|---|---|
| `method` | `"GET"` | `GET` \| `POST` \| `PUT` \| `PATCH` \| `DELETE` |
| `body` | — | `FormData` is sent as-is (no `Content-Type`; fetch sets the multipart boundary). Anything else is `JSON.stringify`'d |
| `cache` | `"no-store"` | Correct for authenticated dashboards. Do not cache authed data |
| `tags` | — | Next.js cache tags (only if you opt into caching) |
| `revalidate` | — | ISR window in seconds |

Leading slashes on `endpoint` are stripped. The request URL is `{getApiBaseUrl()}/{endpoint}`.

### What the client does on every call

1. Call `getAuthToken()`.
2. If a token is returned, set `Authorization: Bearer <token>`.
3. If not, still send the request (login and other public endpoints work this way).
4. Parse JSON into `ApiResponse<TData>` and return it.

Dashboard fetches must stay `cache: "no-store"` (the default). Do not pass `tags` or `revalidate` on authenticated data.

---

## Cookies

| Cookie | Constant | Typical lifetime |
|---|---|---|
| `accessToken` | `ACCESS_TOKEN_COOKIE` | JWT `exp` (fallback **15 minutes**) |
| `refreshToken` | `REFRESH_TOKEN_COOKIE` | JWT `exp` (fallback **7 days**) |

Options (`getAuthCookieOptions`):

- `httpOnly: true` — JS in the browser cannot read them
- `secure: true` in production
- `sameSite: "lax"`
- `path: "/"`
- `maxAge` = seconds until JWT `exp`

`getJwtMaxAgeSeconds` **decodes** the payload (no signature verify). It returns `undefined` if the token is malformed or already expired. The cookie then uses the fallback maxAge.

`setAuthCookies(store, accessToken, refreshToken)` writes both.  
`clearAuthCookies(store)` deletes both.

The `store` is anything with `set` / `delete`:

- Proxy: `response.cookies`
- Server Action / Route Handler: `await cookies()` from `next/headers`

`clearAuthCookiesFromStore()` is the server-only shortcut. Use it in logout. **Do not use it in `proxy.ts`.**

---

## Resolving the access token (`getAuthToken`)

Server-only. Used by `apiClient`. Order:

1. **`x-access-token` request header** (`ACCESS_TOKEN_HEADER`) — set by proxy after a silent refresh so *this* page load can use the new token (Set-Cookie on the response is only visible on the *next* request).
2. **`accessToken` cookie**, if `isValidAccessToken` (JWT `exp` still in the future).
3. Else if **`refreshToken` cookie** exists → `refreshTokens(refreshToken)`.
   - Success → `setAuthCookies` (throws during Server Component render; the new access token is still returned for this call).
   - Failure → `clearAuthCookies`, return `null`.
4. Else return `null`.

---

## Refresh helper (`refreshTokens`)

Plain `fetch`. **Never** goes through `apiClient` (that would recurse).

- `POST {base}/{API_REFRESH_PATH}`
- Body: `{ refreshToken }`
- `cache: "no-store"`
- Returns `{ accessToken, refreshToken }` or `null`

It does **not** read or write cookies. Proxy and `getAuthToken` persist the result.

---

## Proxy (`src/proxy.ts`)

Runs on every document request (matcher skips `api`, `trpc`, `_next`, `_vercel`, and files with an extension). It composes **next-intl** locale routing with session checks.

Public auth paths (locale stripped first, so `/en/login` and `/ar/login` both count):

- `/login`
- `/forget-password`
- `/reset-password`

Everything else is treated as protected.

Redirects keep the current locale (`/en/settings` → `/en/login`).

### Decision tree

1. **Valid `accessToken`**
   - Auth route → redirect `/{locale}`
   - Else → continue (intl middleware)
2. **No valid access, but `refreshToken` present**
   - `refreshTokens()`
   - **Success:** write both cookies on the **response**; set `x-access-token` for this request; if they were on an auth route, redirect home
   - **Failure:** delete both cookies; protected routes redirect to `/{locale}/login`; auth routes stay (now logged out)
3. **No tokens**
   - Protected route → should redirect to login (**currently commented** — see below)
   - Auth route → continue so they can sign in

### Temporary: unauthenticated access

Until the backend is ready, this block is **commented** in `proxy.ts`:

```ts
// TODO: uncomment when backend auth is ready
// if (isProtectedRoute(pathname)) {
//   return NextResponse.redirect(localizedPath(request, "/login"));
// }
```

Without an access token you can still open dashboard pages. A leftover `refreshToken` can still force a refresh; if that fails, cookies are cleared and protected pages go to login.

---

## Why proxy refresh and `getAuthToken` both exist

| Layer | When | Can set cookies? |
|---|---|---|
| `proxy.ts` | Every navigation | Yes — `response.cookies` |
| Server Action / Route Handler | Login / logout / mutations | Yes — `cookies().set` |
| Server Component + `apiClient` | Page data fetch | **No** — `cookies().set` throws |

If the user opens a new page with an expired access cookie but a live refresh cookie:

1. Proxy refreshes, sets new cookies on the **response**, and forwards `x-access-token`.
2. `apiClient` → `getAuthToken` reads the header and uses the new token **without a second refresh**.

That second point matters if the backend **rotates** refresh tokens: a second refresh with the old token would fail and log the user out.

If proxy did not run (or the header is missing), `getAuthToken` can still refresh during a Server Action. During RSC render it can refresh and return the token for that fetch, but it cannot persist cookies (caught internally).

---

## Auth route handlers

| Route | Backend call | Cookie effect |
|---|---|---|
| `POST /api/auth/login` | `apiClient("auth/login", { method: "POST", body })` | `setAuthCookies` from `response.data` |
| `POST /api/auth/refresh` | `refreshTokens(refreshToken)` | Rotates both cookies |
| `POST /api/auth/logout` | `apiClient("auth/logout", { method: "POST" })` (best-effort) | `clearAuthCookiesFromStore()` |

Login expects tokens on **`data`**:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Browser login

```ts
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

---

## Usage examples

### Fetching in a server component

```tsx
import { apiClient } from "@/lib/api";

type Product = { id: string; name: string };

export default async function ProductsPage() {
  const res = await apiClient<Product[]>("products");
  if (!res.success) {
    return <p>{res.message}</p>;
  }

  return <ProductsTable data={res.data ?? []} />;
}
```

### Server action — JSON mutation

```ts
"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api";

export async function updateProductAction(
  _prev: MutationResult | null,
  formData: FormData,
): Promise<MutationResult> {
  const id = String(formData.get("productId") ?? "").trim();
  if (!id) return { success: false, message: "Product is required" };

  const res = await apiClient<Product>(`products/${id}`, {
    method: "PATCH",
    body: {
      name: formData.get("name"),
      price: Number(formData.get("price")),
    },
  });

  if (!res.success) {
    return { success: false, message: res.message, errors: res.errors };
  }

  revalidatePath("/products");
  return { success: true, data: res.data };
}
```

### Server action — file upload (FormData passthrough)

```ts
"use server";

export async function createProductAction(
  _prev: MutationResult | null,
  formData: FormData,
): Promise<MutationResult> {
  const res = await apiClient<Product>("products", { method: "POST", body: formData });
  if (!res.success) {
    return { success: false, message: res.message };
  }

  revalidatePath("/products");
  return { success: true, data: res.data };
}
```

---

## Troubleshooting

| Symptom | Likely cause |
|---------|--------------|
| `Missing NEXT_PUBLIC_API_BASE_URL (or API_URL)` | No `.env.local` — copy `.env.example` and set the backend URL |
| Build error: `server-only cannot be imported from a Client Component` | A `"use client"` file imports `@/lib/api` — move the call into a server action / route handler |
| `statusCode: 0`, `message: "Network error"` | Backend down, wrong base URL, or DNS |
| Session dies right after a refresh during RSC render | Backend uses one-time-use refresh tokens and cookies were not writable — proxy refresh + `x-access-token` is the intended path; add a reuse grace window on the backend |
| Stale data on a dashboard page | A `cache`/`tags`/`revalidate` option was passed on authenticated data — remove it; dashboard fetches must stay `no-store` |
