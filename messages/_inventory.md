# Message catalog inventory

Source codebases:
- English: `en/src`
- Arabic: `ar/src`

Output:
- `messages/en.json`
- `messages/ar.json`

Both files share an identical nested key structure (615 total JSON keys/paths, 526 leaf string values per locale — verified programmatically). Values are locale-specific and were copied from each codebase's actual source strings (not machine-translated), with the exception of a few structural strings synthesized to match the requested schema (e.g. `Common.commandPalette` / `Common.commandDesc`, sourced from the shared shadcn `CommandDialog` default props).

## Namespaces and approximate key counts

| Namespace | Leaf strings | Notes |
|---|---|---|
| `Metadata` | 2 | Root layout `<title>` / `<meta description>` |
| `Common` | 33 | Shared chrome: search, theme switcher, sidebar, pagination, nav-user menu, command palette, logo alt, cross-page CTA labels |
| `Nav` | 20 | Sidebar navigation titles (top-level + sub-items) from `config/navigation.ts` |
| `Auth` | 10 | Login page metadata + `Login_FR` form fields/buttons |
| `Dashboard` | 35 | Home page (`(main)/page.tsx`): section titles/descriptions + per-module `description`/`highlights[]` |
| `Filters` | 125 | Shared filter primitives (`SelectFilter`, `MultipleSelectFilter`, `TabsFilter`, `DateFilter`, `ResetFilters`) + all 8 filter demo pages (titles, section copy, param hints) + shared `options` enum labels (status/category/priority/sort/tags) |
| `Forms` | 128 | Forms index + 4 form demo pages (rich text, image uploader, file uploader, date input) + component-level strings for `DateInput`, `FileUploader`, `ImageUploader`, `RichTextEditor` toolbar (incl. color palettes) |
| `Charts` | 66 | Charts index/analytics pages, all 6 chart components (titles, descriptions, series labels, footers), KPI titles, month/weekday/category/device/traffic-source labels used by `chart-data.ts` |
| `Table` | 27 | Table page, `ProductsTable` columns, status labels, `DataTable` empty state, and the 8 demo product name/category pairs (`prd001`–`prd008`, reused by the dashboard's "recent products" subset) |
| `Settings` | 78 | Settings index, dark-theme page, all background/card preset labels (by stable id), preset group titles/descriptions, and the full `DarkBackgroundPicker` UI (copy buttons, toasts, hints) |
| `User` | 2 | Demo user display name/email (differs per locale by design — matches each codebase's `config/navigation.ts`) |
| **Total** | **526** | |

## Notes

- `Filters.options` and `Table.status` intentionally overlap in meaning with per-page inline option lists (e.g. reset page uses `active`/`draft`/`archived`) — consolidated into one shared enum to avoid duplication.
- ICU/`next-intl` placeholders used: `{count}` (multi-select "N selected", file/image counts, capacity %, preset counts), `{ms}` (filter debounce hints), `{maxFiles}`, `{maxImages}`, `{maxSize}`, `{name}`, `{label}`, `{percent}`.
- `Dashboard.modules.forms.highlights` intentionally has 4 items in English vs 3 in Arabic — this mirrors an actual gap in the Arabic source (`ar/src/app/(main)/page.tsx` omits "Date Input" from that module's highlight list). Not a translation error; preserved faithfully rather than invented.
- Verified programmatically: both JSON files parse as valid UTF-8 JSON, have byte-identical key paths (615/615), and every ICU placeholder token in an English string has a matching token in its Arabic counterpart (and vice versa).
