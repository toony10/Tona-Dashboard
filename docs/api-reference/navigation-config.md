# API Reference: Navigation Config

## File

- `src/config/navigation.ts`

## Exported types

- `NavSubItem`
  - `title: string`
  - `url: string`
- `NavItem`
  - `title: string`
  - `url: string`
  - `icon: LucideIcon`
  - `items?: NavSubItem[]`
- `NavGroup`
  - `label?: string`
  - `items: NavItem[]`

## Exported values

- `navigation: NavGroup[]`
  - Source of truth for dashboard sidebar links and nested module links.
- `user`
  - Mock user profile metadata used by navigation UI.

## Usage guidelines

- Keep URLs aligned with App Router routes.
- Prefer adding feature sub-pages under `items` for grouped modules.
- Use concise, user-facing labels for `title`.
