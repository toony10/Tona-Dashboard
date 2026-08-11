# Architecture

## High-level overview

The app is a Next.js App Router dashboard starter with two route groups:

- `(auth)` for authentication-facing pages.
- `(main)` for the dashboard shell and feature modules.

The root layout composes global providers and scripts for:

- Theme management (`next-themes`).
- URL state adapter (`nuqs`).
- Dark appearance initialization and persistence.
- Global toast notifications (`sonner`).

## Route structure

- `src/app/layout.tsx`: global HTML/body, providers, and app-wide setup.
- `src/app/(auth)/layout.tsx`: visual shell for auth screens.
- `src/app/(main)/layout.tsx`: authenticated dashboard shell with sidebar/header.

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
- Auth route handlers (`/api/auth/login|refresh|logout`) own cookie storage; the API client only reads tokens, refreshes via `refreshSession()`, and retries once on 401.
- Dashboard fetches default to `cache: "no-store"` so authenticated data is never cached.
- All failures are normalized into a single `ApiError` type consumed by server actions and error boundaries.

Full reference: `docs/api-reference/api-client.md`.
