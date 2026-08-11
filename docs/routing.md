# Routing

## Route groups

- `src/app/(auth)`: authentication routes.
- `src/app/(main)`: dashboard and feature routes.

## Core routes

- `/` dashboard overview
- `/login` sign-in page
- `/forms` forms module index
- `/filters` filters module index
- `/charts` charts module index
- `/table` table demo
- `/settings` settings module index

## Feature sub-routes

### Forms

- `/forms/rich-text`
- `/forms/image-uploader`
- `/forms/file-uploader`
- `/forms/date-input`

### Filters

- `/filters/pagination`
- `/filters/select`
- `/filters/multiple-select`
- `/filters/tabs`
- `/filters/date`
- `/filters/search`
- `/filters/limit`
- `/filters/reset`

### Charts

- `/charts/analytics`

### Settings

- `/settings/dark-theme`

## Navigation source

Sidebar navigation is defined in `src/config/navigation.ts` and should stay aligned with this route map.
