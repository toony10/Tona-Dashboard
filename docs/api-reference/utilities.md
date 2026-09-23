# API Reference: Utilities

## File

- `src/lib/utils.ts`

### `cn(...inputs: ClassValue[])`

Combines class names using `clsx`, then resolves Tailwind utility conflicts with `tailwind-merge`.

Use this helper for:

- Conditional class names.
- Variant class composition.
- Preventing conflicting Tailwind class output.

## HTTP helpers (`src/lib/http`)

| Function | Role |
|---|---|
| `toQueryString(params)` | Build a `?key=value` string, skipping empty values |
| `toFormData(fields)` | Build `FormData` from a record (supports `Blob` / arrays) |
| `getImg(src)` | Prefix relative paths with `{API}/files` |
| `getUrlParams(searchParams, spec)` | Parse RSC `searchParams` with typed defaults (`listUrlParams` uses `page`, `limit`, `search`) |

## Date helper (`src/lib/date`)

- `getDate(date, { locale, withTime })` — locale-aware formatted date (Latin numerals).

## Image optimization (`src/lib/images`)

Server-only (`sharp`). Call from server actions only.

- `optimizeImageFile(file, options)`
- `optimizeImageFiles(files, options)`
- Presets in `src/config/image-optimize.ts`

## Direction (`src/lib/i18n`)

- `getDirection(locale)` / `isRtl(locale)` — also re-exported from `src/i18n/config.ts`.

## Pagination types (`src/types/pagination.ts`)

- `PaginationParams`, `Pagination`, `PaginationResponse<T>`

## File

- `src/config/appearance-settings.ts`

### Dark appearance helpers

Key responsibilities:

- Preset definitions for dark background and card colors.
- Preset ID validation helpers.
- Local storage get/set helpers.
- CSS variable application logic for dark mode.
- Pre-hydration initialization script generation.

Key functions include:

- `applyDarkAppearance()`
- `setDarkBackgroundPreset()`
- `setDarkCardPreset()`
- `getAppearanceInitScript()`
