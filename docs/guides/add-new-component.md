# Guide: Add a New Component

## Decide placement

- `src/components/ui` for generic primitives.
- `src/components/shared/<domain>` for reusable feature components.
- `src/components/layout` for shell/navigation concerns.

## Implementation checklist

- Define clear props with TypeScript types.
- Reuse `cn()` from `src/lib/utils.ts` for class merging.
- Keep behavior and styling composable.

## Integration checklist

- Import into one page first for validation.
- Test in both light and dark themes, and in `/en` (LTR) and `/ar` (RTL).
- Prefer logical Tailwind (`ms` / `me` / `ps` / `pe` / `start` / `end`).
- If the component shows copy, add keys to **both** `messages/en.json` and `messages/ar.json`.
- Ensure responsive behavior at common breakpoints.

## Documentation checklist

- Add or update the relevant file in `docs/features/`.
- If globally reusable, mention it in `docs/components.md`.
