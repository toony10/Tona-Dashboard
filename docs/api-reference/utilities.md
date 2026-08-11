# API Reference: Utilities

## File

- `src/lib/utils.ts`

### `cn(...inputs: ClassValue[])`

Combines class names using `clsx`, then resolves Tailwind utility conflicts with `tailwind-merge`.

Use this helper for:

- Conditional class names.
- Variant class composition.
- Preventing conflicting Tailwind class output.

## File

- `src/lib/appearance-settings.ts`

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
