# Styling and Theming

## Styling system

- Tailwind CSS 4 is the primary styling layer.
- Reusable UI components follow shadcn/ui conventions.
- Theme-aware styles rely on CSS variables and utility classes.

## Theme management

- `next-themes` controls light/dark mode state.
- Theme toggles are exposed in layout/auth UI.
- `ThemeProvider` wraps the app in `src/app/layout.tsx`.

## Dark appearance presets

The app extends dark mode with configurable background and card presets:

- Presets are defined in `src/lib/appearance-settings.ts`.
- User choices are persisted in `localStorage`.
- CSS variables `--background` and `--card` are updated dynamically.

## Hydration-safe initialization

`getAppearanceInitScript()` injects a `beforeInteractive` script in the root layout, so dark preset colors apply before hydration and reduce theme flash.
