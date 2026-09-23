# Authentication Feature

## Purpose

The authentication module provides a polished sign-in experience with a dedicated visual layout, theme switcher access, and a server-side session layer backed by httpOnly cookies.

## Route

- `/en/login`, `/ar/login` — UI (locale prefixed)
- `/{locale}/logout` — proxy-only: clear auth cookies, redirect to `/{locale}/login` (no page)
- `loginAction` — server action: credential exchange → set cookies
- `POST /api/auth/refresh` — rotate session cookies
- `POST /api/auth/logout` — best-effort backend logout + clear session cookies

There is **no** `POST /api/auth/login` route. The login form calls `loginAction` via `useCrudForm`.

## Included capabilities

- Branded auth background container.
- Centered login form card with Zod + `useCrudForm`.
- Theme switcher and locale switcher on the auth screen.
- Entry animation wrapper for smoother UX.
- Server-side token storage (`accessToken` / `refreshToken` httpOnly cookies).
- Optional client profile cache (`setAuthUser` / `getAuthUser`) for header/nav without decoding JWT.
- Silent refresh in `src/proxy.ts` (locale-aware redirects, writes cookies + `x-access-token`).
- Server Action fallback refresh inside `getAuthToken()` (`next-action` only).
- HTTP 401 retry in `apiClient` (`refreshAndPersist` once, then `/{locale}/logout`).

## Primary building blocks

- `src/app/[locale]/(auth)/layout.tsx`
- `src/proxy.ts`
- `src/actions/auth/login.actions.ts`
- `src/services/auth/auth.api.ts`
- `src/validations/auth/auth.schemas.ts`
- `src/app/api/auth/{refresh,logout}/route.ts`
- `src/lib/auth/` + `src/lib/api/`
- `src/lib/forms/` (`useCrudForm`, `runAction`, `FormErrors`, `SubmitButton`)
- `src/lib/auth/user-storage.ts`
- `LoginForm`
- `AuroraBackground`
- `ThemeSwitcher`
- `AnimationWrapper`

## Session model

1. The login form submits a typed object to `loginAction` (not FormData, not `/api/auth/login`).
2. The action validates with `createLoginSchema`, then `runAction` calls `login()` → `apiClient("auth/login")`. A 401 **without** a Bearer token is treated as bad credentials (no redirect).
3. Tokens are stored as httpOnly cookies (`sameSite=lax`, `secure` in production); `maxAge` comes from the JWT `exp` claim (15m / 7d fallbacks).
4. If the backend also returns user fields (`id`, `email`, …), the action returns them and the client stores them with `setAuthUser`.
5. On navigation, `proxy.ts` strips any client `x-access-token`, refreshes if the access cookie is expired (redirects keep `/en` or `/ar`), and forwards the new token on this request. `apiClient` then sends `Authorization: Bearer <token>` from that header or the `accessToken` cookie, plus `Accept-Language` from `getRequestLocale()`.
6. If the API still returns 401 with a Bearer token (revoked access, clock skew), `apiClient` force-refreshes once and retries. Failure redirects to `/{locale}/logout`, where the proxy clears cookies and sends the user to `/{locale}/login`.

Unauthenticated access to dashboard pages is **currently allowed**. The protected-route redirect in `proxy.ts` is commented with a TODO until the auth system / backend is ready.

Full reference: `docs/api-reference/api-client.md`.
