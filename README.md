# Tona Dashboard (Multi-lang)

A production-ready admin dashboard starter with **English** and **Arabic** in one codebase. Built with Next.js, next-intl, shadcn/ui, and Tailwind CSS — including reusable modules for charts, tables, filters, forms, and settings.

Replaces the separate `en` / `ar` apps with a single locale-routed project (`/en/…`, `/ar/…`) and full RTL / LTR support.

## Features

- **Bilingual UI** — English (`en`) and Arabic (`ar`) via [next-intl](https://next-intl.dev), with a header locale switcher
- **RTL / LTR** — `lang` + `dir` on `<html>`, locale fonts, sidebar side flip, logical Tailwind classes
- **Dashboard** — KPI cards, analytics previews, and module navigation
- **Forms** — Rich text editor, image/file uploaders, and date inputs
- **Filters** — URL-synced search, select, tabs, date, pagination, and reset controls
- **Charts** — Recharts-based line, area, bar, pie, and radial visualizations
- **Table** — Sortable data tables powered by TanStack Table
- **Settings** — Dark theme customization with persistent presets
- **Auth** — Login screen with theme + language switching

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js **16.3** (App Router) · React **19.2** · TypeScript |
| i18n | next-intl · `messages/en.json` + `messages/ar.json` |
| UI | Tailwind CSS 4 · shadcn/ui · Lucide |
| Data UI | Recharts · TanStack Table · TipTap · nuqs · next-themes |

## Getting started

```bash
cp .env.example .env.local   # optional — needed for backend API auth
npm install
npm run dev
```

Open:

- [http://localhost:3000/en](http://localhost:3000/en) — English (LTR)
- [http://localhost:3000/ar](http://localhost:3000/ar) — Arabic (RTL)

Root `/` redirects to the default locale (`en`).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Project structure

```
messages/                 # Translation catalogs (keep en/ar keys in sync)
src/
  app/
    [locale]/             # All UI routes — /en/… and /ar/…
      (auth)/login
      (main)/…            # Dashboard, forms, filters, charts, table, settings
    api/                  # Auth API routes (locale-agnostic)
  components/
    layout/               # Sidebar, header, LocaleSwitcher, theme switcher
    shared/               # Filters, forms, charts, table, AppLink
    ui/                   # shadcn primitives
  config/
    navigation.ts         # Nav urls + titleKeys (no hardcoded titles)
  i18n/
    routing.ts            # Locales + default locale
    navigation.ts         # Locale-aware Link / useRouter / usePathname
    request.ts            # Loads messages per request
    config.ts             # getDirection / isRtl helpers
  proxy.ts                # next-intl locale middleware (Next.js 16)
docs/
  i18n.md                 # i18n & RTL patterns (start here for localization)
  …                       # Feature guides, architecture, API reference
```

## Internationalization

- Routes live under `src/app/[locale]/…`
- Copy lives in `messages/en.json` and `messages/ar.json` (identical key trees)
- Use `AppLink` (or `@/i18n/navigation`) instead of raw `next/link`
- Prefer logical Tailwind: `ms` / `me` / `ps` / `pe` / `start` / `end` / `text-start`
- Navigation config uses `id` + `titleKey`; resolve titles with `useTranslatedNavigation()`

Full patterns (server/client translations, adding pages, RTL checklist): **[docs/i18n.md](./docs/i18n.md)**.

### Adding a translated page (short version)

1. Create the route under `src/app/[locale]/(main)/…`
2. Add keys to **both** `messages/en.json` and `messages/ar.json`
3. Use `getTranslations` (server) or `useTranslations` (client)
4. If it belongs in the sidebar, add `titleKey` in `config/navigation.ts` + matching `Nav.*` keys

## Documentation

See [`docs/`](./docs/) for feature guides, architecture, routing, and contributor how-tos. For multi-lang specifics, start with [`docs/i18n.md`](./docs/i18n.md).

## Environment

| Variable | Description |
|---|---|
| `API_URL` | Backend API base URL (server-only). See `.env.example`. |
