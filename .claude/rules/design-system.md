# Tona Dashboard Design System Rules

## 1. Component Splitting

Split a page into smaller components **only when it has more than one independent concern** (each concern usually means its own data fetching / mutation logic).

- Example: a page with KPI cards (its own fetch) + a data table with CRUD (its own fetch + mutations) → split into at least 2 components in the route `_components/` folder.
- Example: a page that is *only* a data table (fetch + CRUD, nothing else) → keep it as **one** component. Do not split just for the sake of splitting.
- Route-only UI (list shells, entity tables, detail action bars) lives in the route `_components/` folder.
- Keep `page.tsx` a Server Component. Only `_components`, dialogs, and forms are `"use client"`. Never mark a whole page `"use client"` just to host a dialog.

## 2. Loading UI

- **Single fetch page**: use `loading.tsx` in the route segment with a shared skeleton (`ListPage_SK`, `DetailsPage_SK`, `HubPage_SK` from `@/components/shared/skeletons`). Do not add a local `Suspense` boundary for it.
- **Multiple independent fetches (multiple components)**: wrap **each** data-fetching component in its own `<Suspense fallback={<ComponentSkeleton />}>` so a slow fetch never blocks the rest of the page. In this case, either skip `loading.tsx` or keep it minimal.
- Skeletons should match the shape of the content they replace (same layout/grid), not a generic spinner. Build them from `@/components/shared/skeletons/primitives`.
- On API failure, render `<ErrorHandler statusCode={…} message={…} />` (403 → forbidden page). If a section can fail independently, scope the error to that section instead of failing the whole page.

## 3. Colors — Semantic Tokens Only

Never hardcode colors (`text-[#27AE60]`, `bg-[#000]`, etc.) unless the color is genuinely outside the design system's palette.

Use the theme tokens from `src/app/globals.css` by default:
- `primary` — primary actions, active states, links
- `foreground` — main text
- `muted-foreground` — secondary text, descriptions, helper text, small labels
- `background` / `card` — page and card backgrounds
- `border`, `accent`, `destructive`, `chart-*`, `sidebar-*` — use where semantically appropriate

Dark mode backgrounds come from the presets in `src/config/appearance-settings.ts` (they set `--background` and `--card`), so never hardcode a dark background.

Before hardcoding any color found in a design:
1. Check if it's a shade of an existing token and use the token.
2. Only hardcode if the color is clearly unrelated to the palette. If a color repeats, propose adding it as a new token in `globals.css` instead.

## 4. Reuse Shared UI Components

Before building any UI element, check `src/components/ui/` (shadcn primitives) and `src/components/shared/**` first.

- Match by **functionality/API, not just visual appearance**. Example: if a design shows a table that looks different from `@/components/shared/table/DataTable`, but it's still a table (sorting, pagination, selection) → use `DataTable` and adjust styling/props, do not create a new table component.
- Page chrome: `BreadCrumb` + `MainH` / `SectionH`. Status: `StatusIndicator` + `statusTone()`. Filters: the URL-synced filters in `shared/filters`. Form widgets: `shared/forms`.
- If no existing component fits, build it in `src/components/shared/<domain>/` (feature component) or `src/components/ui/` (generic primitive), not inside a route.
- If an existing component is close but missing a variant/prop, extend it rather than duplicating it.
- Merge classes with `cn()` from `@/lib/utils`.

## 5. RTL / LTR

This app serves `en` (LTR) and `ar` (RTL). Every screen must work in both. Always use logical CSS properties instead of physical (left/right) ones:

| Don't use | Use instead |
|---|---|
| `pl-*`, `pr-*` | `ps-*`, `pe-*` |
| `ml-*`, `mr-*` | `ms-*`, `me-*` |
| `left-*`, `right-*` | `start-*`, `end-*` |
| `text-left`, `text-right` | `text-start`, `text-end` |
| `rounded-l-*`, `rounded-r-*` | `rounded-s-*`, `rounded-e-*` |
| `border-l`, `border-r` | `border-s`, `border-e` |

- Directional icons (arrows, chevrons, "back" icons) get `className="rtl:rotate-180"`.
- LTR islands (email, price, password, codes) get `dir="ltr"`.
- When a component needs the direction in code (e.g. sidebar `side`), use `useIsRtl()` from `@/hooks/use-translated-navigation` or `getDirection()` from `@/lib/i18n`.
- Never assume LTR order in flex/grid.

## 6. Detail-page action buttons

Use `actionButtonVariant` from `@/components/shared/actions`. Order: **primary first**, then secondary, **destroy last**.

- `primary` — the main constructive action (Update / Renew / Edit)
- `secondary` — everything else (`outline-primary`: primary border + text)
- `destroy` — Cancel / Delete only (filled destructive)

Do not use the gray `outline` variant on detail action bars.
