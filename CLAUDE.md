@AGENTS.md

# Tona Dashboard (Multi-lang)

Next.js 16 (App Router) admin dashboard starter in **English and Arabic** from one codebase, using next-intl. Routes live under `src/app/[locale]/` (`/en/…`, `/ar/…`). UI is shadcn/ui + Tailwind CSS 4.

## Commands

- `npm run dev` (http://localhost:3000)
- `npm run build`
- `npm run lint`

There is no test runner. Check changes with `npm run lint` and `npm run build`.

## Rules

Project conventions live in `.claude/rules/`:

- `design-system.md` (always loaded): component splitting, loading UI, semantic color tokens, shared UI reuse, RTL/LTR, detail-page actions
- `app-folder-structure.md` (loaded for `src/**`): routes and `_components`, component folders, types/schemas/services/actions layering, file suffixes (`_FR`, `_DL`, `_SK`), CRUD rules
- `i18n-messages.md` (loaded for `messages/**` and `src/**`): catalogs, namespaces, key naming, translations in server/client/actions

Follow the existing code. When a rule and the code disagree, ask before changing the pattern. Every screen must work in `/en` (LTR) and `/ar` (RTL), light and dark.

## Docs

See `docs/README.md` for the index. The most useful ones are `docs/guides/crud-setup.md`, `docs/guides/add-new-page.md`, `docs/i18n.md` and `docs/architecture.md`. When you add a reusable component or feature, update `docs/components.md` or the matching file in `docs/features/`.
