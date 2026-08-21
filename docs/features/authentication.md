# Authentication Feature

## Purpose

The authentication module provides a polished sign-in experience with a dedicated visual layout, theme switcher access, and a server-side session layer backed by httpOnly cookies.

## Route

- `/en/login`, `/ar/login` — UI (locale prefixed)
- `/{locale}/logout` — proxy-only: clear auth cookies, redirect to `/{locale}/login` (no page)
- `POST /api/auth/login` — credential exchange → set cookies
- `POST /api/auth/refresh` — rotate session cookies
- `POST /api/auth/logout` — best-effort backend logout + clear session cookies

## Included capabilities

- Branded auth background container.
- Centered login form card.
- Theme switcher directly on auth screen.
- Entry animation wrapper for smoother UX.
- Server-side token storage (`accessToken` / `refreshToken` httpOnly cookies).
- Silent refresh in `src/proxy.ts` (locale-aware redirects, writes cookies + `x-access-token`).
- Server Action fallback refresh inside `getAuthToken()` (`next-action` only).
- HTTP 401 retry in `apiClient` (`refreshAndPersist` once, then `/{locale}/logout`).

## Primary building blocks

- `src/app/[locale]/(auth)/layout.tsx`
- `src/proxy.ts`
- `src/app/api/auth/{login,refresh,logout}/route.ts`
- `src/lib/auth/` + `src/lib/api/`
- `LoginForm`
- `AuroraBackground`
- `ThemeSwitcher`
- `AnimationWrapper`

## Session model

1. Browser posts credentials to `/api/auth/login`.
2. The route handler calls `apiClient("auth/login")` and reads tokens from `response.data`. A 401 **without** a Bearer token is treated as bad credentials (no redirect).
3. Tokens are stored as httpOnly cookies (`sameSite=lax`, `secure` in production); `maxAge` comes from the JWT `exp` claim (15m / 7d fallbacks).
4. On navigation, `proxy.ts` strips any client `x-access-token`, refreshes if the access cookie is expired (redirects keep `/en` or `/ar`), and forwards the new token on this request. `apiClient` then sends `Authorization: Bearer <token>` from that header or the `accessToken` cookie.
5. If the API still returns 401 with a Bearer token (revoked access, clock skew), `apiClient` force-refreshes once and retries. Failure redirects to `/{locale}/logout`, where the proxy clears cookies and sends the user to `/{locale}/login`.

Full reference: `docs/api-reference/api-client.md`.
