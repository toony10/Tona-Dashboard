# Guide: Add a New Page

## 1) Create the route file

Add a `page.tsx` under the locale segment.

Example:

- `src/app/[locale]/(main)/reports/page.tsx`

Keep `page.tsx` a Server Component. Put dialogs and tables in `_components/` or `src/components`.

## 2) Compose with shared building blocks

- Use `BreadCrumb` + `MainH` for page chrome.
- Use `ListPage_SK` / `DetailsPage_SK` / `HubPage_SK` in colocated `loading.tsx`.
- On API failure, render `<ErrorHandler statusCode={…} message={…} />` (403 → forbidden page).
- Use existing `Card`, `Button`, filters, and `DataTable` first.

## 3) i18n

Add keys to **both** `messages/en.json` and `messages/ar.json`. Use `getTranslations` on the server page.

## 4) Register in sidebar navigation

Update `src/config/navigation.ts`:

- Add a new top-level item or sub-item with `titleKey` (no hardcoded titles).
- Add matching `Nav.*` keys in both catalogs.

## 5) Mutations (if the page writes data)

Follow the forms kit. Full recipes: [CRUD setup](./crud-setup.md).

- Types → Zod schema → `src/services/{domain}/*.api.ts` (`apiClient` only here)
- `src/actions/{domain}/*.actions.ts` with `runAction` (no `apiClient`)
- `{Entity}_FR` + `FormDialog` / `ConfirmDialog`

## 6) Validate in UI

- Confirm `/en/…` and `/ar/…` both work.
- Confirm sidebar link appears and navigates (top loader should show).
- Confirm dark/light themes and RTL layout.
