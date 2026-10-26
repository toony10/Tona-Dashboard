---
paths:
  - "src/**"
---

# App folder structure and naming

Full recipes: [docs/guides/crud-setup.md](../../docs/guides/crud-setup.md), [docs/guides/add-new-page.md](../../docs/guides/add-new-page.md), [docs/guides/add-new-component.md](../../docs/guides/add-new-component.md).

## Routes

Pages live under `src/app/[locale]/(main)/` (dashboard) or `src/app/[locale]/(auth)/` (auth screens).

Colocate route-only components next to the route's `page.tsx`:

```
src/app/[locale]/(main)/products/
  page.tsx                 # Server Component
  loading.tsx              # shared skeleton
  _components/
    ProductsTable.tsx      # client table + inline dialog triggers
  [id]/
    page.tsx
    _components/
      ProductDetailsActions.tsx
```

- `_components/` is for UI used **only on that route** (list tables, detail action bars, page pieces).
- Reusable dialogs, forms, and widgets go in `src/components/`, not `_components/`.
- Sidebar entries go in `src/config/navigation.ts` with a `titleKey` (never a hardcoded title).

## Components (`src/components/`)

| Folder | Contents |
|---|---|
| `ui/` | shadcn primitives |
| `layout/` | app shell (sidebar, header, nav, switchers) |
| `shared/<domain>/` | reusable feature components (table, filters, charts, skeletons, text, status, …) |
| `forms/<domain>/` | entity forms `{Entity}_FR.tsx` |
| `dialogs/<domain>/` | entity dialogs `{Operation}{Entity}_DL.tsx` |
| `providers/` | app-level providers |

Folders with several exports have an `index.ts` barrel.

## Data layer

| Layer | Path | File pattern |
|---|---|---|
| Types | `src/types/{domain}/` | `{entity}.types.ts` + `index.ts` |
| Schemas | `src/validations/{domain}/` | `{entity}.schemas.ts` + `index.ts` |
| Services | `src/services/{domain}/` | `{entity}.api.ts` + `index.ts` |
| Actions | `src/actions/{domain}/` | `{entity}.actions.ts` (`"use server"`) + `index.ts` |

- Services are the **only** files that import `apiClient` (`@/lib/api`). They hold reads and writes.
- Server actions call service functions inside `runAction`'s `handler` (`@/lib/forms/server`). Never import `apiClient` in `*.actions.ts`.
- Client components import from `@/lib/forms`. Never import `runAction` or `apiClient` in a client component.
- RSC pages and loaders import reads from `@/services/{domain}`.
- Use the **same** Zod schema in `useCrudForm` and `runAction`. Use a schema factory that takes `t` when validation copy is translated (see `createLoginSchema`).
- Forms submit a **plain object**, not `FormData`. Build `FormData` in the action or service when the API needs multipart (`toFormData` from `@/lib/http`).
- `apiClient` returns `ApiResponse` and never throws for HTTP errors: check `response.success`.

## Suffix conventions

| Suffix / pattern | Use |
|---|---|
| `_FR` | Form components (`Product_FR.tsx`, `Login_FR.tsx`) — Add and Update share one form when fields overlap |
| `_DL` | Dialog components (`AddProduct_DL.tsx`) — wrap `FormDialog` (add/update, pass `key={formKey}`) or `ConfirmDialog` (delete/confirm) |
| `_SK` | Skeleton components (`ListPage_SK.tsx`) |
| `.actions.ts` | Server action files |
| `.api.ts` | Service files (HTTP calls) |
| `.schemas.ts` | Zod schema files |
| `.types.ts` | TypeScript type files |

One dialog component per operation, usable with a `trigger` **or** controlled (`open` / `onOpenChange`). Never two twin components for the same operation.

## CRUD rules

- Toasts use `result.message` from the backend. Do not hardcode toast strings.
- Do not add a `select` column to `DataTable` — `enableRowSelection` prepends it.
- Delete from a detail page passes `redirectTo` with the locale: `` redirectTo={`/${locale}/products`} ``.
- Paginated tables with simple forms use inline `_DL` triggers per row. Heavy forms (uploads, many fields) use one controlled dialog instance loaded with `next/dynamic`.
