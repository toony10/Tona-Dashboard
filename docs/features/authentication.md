# Authentication Feature

## Purpose

The authentication module provides a polished sign-in experience with a dedicated visual layout, theme switcher access, and a server-side session layer backed by httpOnly cookies.

## Route

- `/en/login`, `/ar/login` — UI (locale prefixed)
- `POST /api/auth/login` — credential exchange → set cookies
- `POST /api/auth/refresh` — rotate session cookies
- `POST /api/auth/logout` — clear session cookies

## Included capabilities

- Branded auth background container.
- Centered login form card.
- Theme switcher directly on auth screen.
- Entry animation wrapper for smoother UX.
- Server-side token storage (`accessToken` / `refreshToken` httpOnly cookies).
- Silent refresh in `src/proxy.ts` (locale-aware redirects, writes cookies + `x-access-token`) and a fallback refresh inside `getAuthToken()`.

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
2. The route handler calls `apiClient("auth/login")` and reads tokens from `response.data`.
3. Tokens are stored as httpOnly cookies (`sameSite=lax`, `secure` in production); `maxAge` comes from the JWT `exp` claim (15m / 7d fallbacks).
4. On navigation, `proxy.ts` refreshes if the access cookie is expired (redirects keep `/en` or `/ar`). `apiClient` then sends `Authorization: Bearer <token>` from the `x-access-token` header or the `accessToken` cookie.

Full reference: `docs/api-reference/api-client.md`.
