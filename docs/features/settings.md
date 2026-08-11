# Settings Feature

## Purpose

The settings module allows users to personalize dashboard appearance, with current emphasis on dark theme color presets.

## Routes

- `/settings`
- `/settings/dark-theme`

## Included capabilities

- Background preset selection for dark mode.
- Card color preset selection for dark mode.
- Persistent appearance preferences via local storage.
- Immediate UI updates through CSS variable overrides.

## Primary building blocks

- `DarkBackgroundPicker`
- Appearance utility functions in `src/lib/appearance-settings.ts`

## Notes

The settings index is designed as an extensible hub, with placeholder space for additional appearance and personalization options.
