# Guide: Dark Theme Customization

## Overview

Dark appearance customization is implemented through predefined preset IDs mapped to colors in `src/lib/appearance-settings.ts`.

## How it works

- Selected preset IDs are stored in local storage.
- `AppearanceProvider` reapplies appearance when theme changes.
- Root layout injects a pre-hydration script to avoid flash.

## Extend with a new background preset

1. Add an entry to `darkBackgroundPresets`.
2. Keep `id` stable and unique.
3. Ensure UI pickers expose the new preset.

## Extend with a new card preset

1. Add an entry to `darkCardPresets`.
2. Use `value: null` if the preset should fall back to default card color.
3. Validate readability against text and border colors.

## Validation checklist

- Switch between light and dark themes.
- Refresh the page and confirm persistence.
- Test both dashboard shell and card surfaces.
