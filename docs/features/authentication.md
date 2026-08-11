# Authentication Feature

## Purpose

The authentication module provides a polished sign-in experience with a dedicated visual layout, theme switcher access, and a server-side session layer backed by httpOnly cookies.

## Route

- `/login` — UI
- `POST /api/auth/login` — credential exchange → set cookies
- `POST /api/auth/refresh` — rotate session cookies
- `POST /api/auth/logout` — clear session cookies

## Included capabilities

- Branded auth background container.
- Centered login form card.
- Theme switcher directly on auth screen.
- Entry animation wrapper for smoother UX.
- Server-side token storage (`access_token` / `refresh_token` httpOnly cookies).
- Automatic token refresh with single-flight deduplication (via `@/lib/auth` + the API client).

## Primary building blocks

- `src/app/(auth)/layout.tsx`
- `src/app/api/auth/{login,refresh,logout}/route.ts`
- `src/lib/auth/{cookies,jwt,refresh}.ts`
- `LoginForm`
- `AuroraBackground`
- `ThemeSwitcher`
- `AnimationWrapper`

## Session model

1. Browser posts credentials to `/api/auth/login`.
2. The route handler calls the backend and receives `{ accessToken, refreshToken }`.
3. Tokens are stored as httpOnly cookies (`sameSite=lax`, `secure` in production); `maxAge` comes from `expiresIn` or the JWT `exp` claim.
4. The API client reads `access_token` for `Authorization` headers and calls `refreshSession()` on 401 (once, with concurrency coalescing).

Full reference: `docs/api-reference/api-client.md`.
