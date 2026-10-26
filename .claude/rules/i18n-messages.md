---
paths:
  - "messages/**"
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# i18n catalogs (next-intl)

Full reference: [docs/i18n.md](../../docs/i18n.md).

Copy lives in `messages/en.json` and `messages/ar.json`, loaded by `src/i18n/request.ts`. Key trees and ICU tokens (`{count}`, `{name}`) must be identical in both files. Never add a key to only one catalog.

No user-facing strings in TSX.

- **Server Components:** follow the existing pages — read `locale` from `params`, call `setRequestLocale(locale)`, then `getTranslations({ locale, namespace: "Dashboard" })`.
- **Client Components:** `useTranslations("Filters")` then `t("search.placeholder")` — not the full path with no namespace.
- **Server Actions:** the client sends `useLocale()` into the action. Use `getActionTranslations(locale, namespace)` from `@/i18n/get-action-translations`. Do not call `getLocale()` or `getTranslations` without a locale.
- **Links and navigation:** `AppLink` (`@/components/shared/navigation/AppLink`) or `@/i18n/navigation` (`usePathname`, `useRouter` with the top loader). Never raw `next/link`.
- **Sidebar:** `src/config/navigation.ts` stores `id` + `titleKey`. Resolve titles with `useTranslatedNavigation()`. Add matching `Nav.*` keys in both catalogs.
- `apiClient` sends `Accept-Language` from `getRequestLocale()`, so backend messages are already localized.

## Namespaces (PascalCase, one concern each)

| Namespace | Use for |
|---|---|
| `Metadata` | `appName` for the title template (`{appName} - %s`) |
| `Common` | app chrome: `error`, `forbidden`, `notFound`, `breadcrumb`, … |
| `Nav` | sidebar labels |
| `Auth` | one object per auth form (`Auth.loginForm`) |
| `Crud` | forms kit: confirm, cancel, save, saving, errorsTitle, unexpectedError |
| `Filters`, `Forms`, `Charts`, `Table` | shared widgets (`Table` holds empty state + selection chrome) |
| `Dashboard`, `Settings`, `User` | app pages |

**Domain:** one namespace per entity (`Products`, `Orders`). Reuse `Crud` / `Table` / `Filters` — never copy Save/Cancel into an entity. Do not dump feature copy into `Common`.

## Entity template

```json
"Products": {
  "pageTitle": "Products",
  "fields": { "name": "Name", "sku": "SKU" },
  "columns": { "name": "Name", "status": "Status" },
  "status": { "active": "Active", "draft": "Draft" },
  "dialogs": {
    "addTitle": "Add product",
    "updateTitle": "Edit product",
    "deleteTitle": "Delete product",
    "deleteDescription": "Delete {name}? This cannot be undone."
  },
  "bulk": { "deleteSelected": "Delete selected" }
}
```

Nest by UI role (`fields`, `columns`, `dialogs`, `status`), not by screen. camelCase leaves named by meaning (`pageTitle`, `emailPlaceholder`) — not by component file. ICU interpolation and plurals only; placeholder names must match in `en` and `ar`.

**Not in messages:** mutation toasts (use backend `result.message`), RTL/direction hacks, a new top-level namespace for a single button.

```tsx
// ❌ BAD
<button>Add product</button>

// ✅ GOOD
const t = useTranslations("Products");

<button>{t("dialogs.addTitle")}</button>
```
