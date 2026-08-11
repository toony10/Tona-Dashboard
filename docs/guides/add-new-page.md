# Guide: Add a New Page

## 1) Create the route file

Add a `page.tsx` in the correct route group under `src/app`.

Example:

- `src/app/(main)/reports/page.tsx`

## 2) Compose with shared building blocks

- Use `MainH` for page heading consistency.
- Use existing `Card`, `Button`, and shared domain components first.

## 3) Register in sidebar navigation

Update `src/config/navigation.ts`:

- Add a new top-level item or sub-item.
- Keep URL and label aligned with the route.

## 4) Validate in UI

- Confirm route works directly in browser.
- Confirm sidebar link appears and navigates.
- Confirm dark/light themes render as expected.
