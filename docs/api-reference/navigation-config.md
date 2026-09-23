# API Reference: Navigation Config

## File

- `src/config/navigation.ts`

## Exported types

- `NavTitleKey`
  - Message key under the `Nav` namespace (e.g. `dashboard` → `Nav.dashboard`).
- `NavSubItem`
  - `titleKey: NavTitleKey`
  - `url: string`
- `NavItem`
  - `id: string` — stable module id (never translate)
  - `titleKey: NavTitleKey`
  - `url: string`
  - `icon: LucideIcon`
  - `items?: NavSubItem[]`
- `NavGroup`
  - `labelKey?: string`
  - `items: NavItem[]`

## Exported values

- `navigation: NavGroup[]`
  - Source of truth for dashboard sidebar links and nested module links.
- `user`
  - Mock user profile metadata used by navigation UI.

## Usage guidelines

- Keep URLs aligned with App Router routes (`src/app/[locale]/…`).
- Prefer adding feature sub-pages under `items` for grouped modules.
- Store `id` + `titleKey` only — never hardcoded titles. Resolve copy with `useTranslatedNavigation()`.
- Add matching `Nav.*` keys to **both** `messages/en.json` and `messages/ar.json`.
