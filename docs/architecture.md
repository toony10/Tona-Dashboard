# Architecture

## High-level overview

The app is a Next.js App Router dashboard starter with two route groups:

- `(auth)` for authentication-facing pages.
- `(main)` for the dashboard shell and feature modules.

The root layout composes global providers and scripts for:

- Theme management (`next-themes`).
- URL state adapter (`nuqs`).
- Navigation progress (`TopLoader` / `nextjs-toploader`).
- Dark appearance initialization and persistence.
- Global toast notifications (`sonner`).
- Locale metadata title template (`{appName} - %s`).

## Route structure

- `src/app/[locale]/layout.tsx`: locale HTML/body, providers, and app-wide setup.
- `src/app/[locale]/(auth)/layout.tsx`: visual shell for auth screens.
- `src/app/[locale]/(main)/layout.tsx`: authenticated dashboard shell with sidebar/header.
- `src/app/[locale]/error.tsx` / `not-found.tsx`: shared `ErrorPage` and `NotFoundPage`.

## UI composition

- Layout primitives in `src/components/layout`.
- Reusable UI building blocks in `src/components/ui`.
- Domain-specific components under `src/components/shared`.

## State and persistence

- Theme state is managed by `next-themes`.
- Filter state is synchronized in URL query params via `nuqs`.
- Dark appearance presets persist in `localStorage`.
- Sidebar default state is read from the `sidebar_state` cookie.

## Data layer

Backend communication goes through a server-only API client in `src/lib/api/`, with auth isolated in `src/lib/auth/`:

- All backend requests are made server-side (server components, server actions, route handlers) — client components never call the backend directly.
- `apiClient` returns `ApiResponse` and never throws for HTTP/JSON errors. Callers check `response.success`. Every request sends `Accept-Language` from `getRequestLocale()`.
- Domain mutations go through `src/lib/forms/` (`useCrudForm`, `FormDialog`, `ConfirmDialog`, `runAction`). Services (`src/services/`) are the only layer that imports `apiClient`. Full recipes: `docs/guides/crud-setup.md`.
- `src/proxy.ts` composes next-intl locale routing with silent refresh: it strips client `x-access-token`, handles `/{locale}/logout`, writes cookies on the response, and forwards `x-access-token` for the current request. Redirects keep the current locale (`/en/settings` → `/en/login`). Unauthenticated dashboard access is currently allowed (protected-route redirect is commented).
- `apiClient` retries once on HTTP 401 (force-refresh), then redirects to `/{locale}/logout` if the session is dead.
- Auth cookies (`accessToken` / `refreshToken`) are httpOnly. `loginAction` and the logout/refresh route handlers persist them via `setAuthCookies` / `clearAuthCookies`.
- Dashboard fetches default to `cache: "no-store"` so authenticated data is never cached.

Full reference: `docs/api-reference/api-client.md`.
