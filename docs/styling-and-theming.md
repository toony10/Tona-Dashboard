# Styling and Theming

## Styling system

- Tailwind CSS 4 is the primary styling layer.
- Reusable UI components follow shadcn/ui conventions.
- Theme-aware styles rely on CSS variables and utility classes.

## Palette and tokens

`src/app/globals.css` defines a blue primary, violet secondary and mint accent. Each hue has a strong fill, a soft container and the text color that reads on that container:

- `primary` / `primary-container` / `on-primary-container`
- `secondary` / `secondary-container` / `on-secondary-container`
- `success`, `warning`, `destructive` with matching `-container` / `on-*-container` tokens
- `surface-low` for table headers, dialog and card footers

Depth uses three shadows: `shadow-card` (flat cards), `shadow-overlay` (menus, dialogs, sheets) and `shadow-lift` (only the filled primary button). The `state-layer` utility adds the hover/press tint to buttons.

Density comes from `--radius`, `--control-h` (buttons, inputs, selects), `--row-h` (table rows) and `--page-gap` (`.page-stack` and the main column).

The page background is a faint grid under soft pools of the brand hues (`--canvas-*`). The header illustration uses the `--scene-*` tokens.

Fonts: IBM Plex Sans for English and Cairo for Arabic, IBM Plex Mono for code.

## Theme management

- `next-themes` controls light/dark mode state.
- Theme toggles are exposed in layout/auth UI.
- `ThemeProvider` wraps the app in `src/app/[locale]/layout.tsx`.

## Dark appearance presets

The app extends dark mode with configurable background and card presets:

- Presets are defined in `src/config/appearance-settings.ts`. The default is `night-indigo`, which matches the palette's dark tokens.
- User choices are persisted in `localStorage`.
- CSS variables `--background` and `--card` are updated dynamically.

## Hydration-safe initialization

`getAppearanceInitScript()` injects a `beforeInteractive` script in the root layout, so dark preset colors apply before hydration and reduce theme flash.
