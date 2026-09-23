# Routing

## Route groups

- `src/app/[locale]/(auth)`: authentication routes.
- `src/app/[locale]/(main)`: dashboard and feature routes.

Locales are `en` and `ar` (`localePrefix: "always"`). `src/proxy.ts` composes next-intl with session refresh: it strips client `x-access-token`, clears cookies on `/{locale}/logout`, and redirects authenticated users away from `/{locale}/login`. See `docs/api-reference/api-client.md`.

## Core routes

- `/{locale}` dashboard overview
- `/{locale}/login` sign-in page
- `/{locale}/logout` session-end (proxy clears cookies, redirects to `/{locale}/login`; no page)
- `/{locale}/forms` forms module index
- `/{locale}/filters` filters module index
- `/{locale}/charts` charts module index
- `/{locale}/table` table demo
- `/{locale}/settings` settings module index
- `src/app/[locale]/error.tsx` unexpected render errors (`ErrorPage`)
- `src/app/[locale]/not-found.tsx` unknown routes (`NotFoundPage`)

Feature sub-routes below are relative to `/{locale}`.

## Feature sub-routes

### Forms

- `/forms/rich-text`
- `/forms/image-uploader`
- `/forms/file-uploader`
- `/forms/date-input`

### Filters

- `/filters/pagination`
- `/filters/select`
- `/filters/multiple-select`
- `/filters/tabs`
- `/filters/date`
- `/filters/search`
- `/filters/limit`
- `/filters/reset`

### Charts

- `/charts/analytics`

### Settings

- `/settings/dark-theme`

## Navigation source

Sidebar navigation is defined in `src/config/navigation.ts` and should stay aligned with this route map.
