# Tech Stack

## Core framework

- Next.js 16 (App Router)
- React 19
- TypeScript 5

## UI and styling

- Tailwind CSS 4
- shadcn/ui component patterns
- Radix UI primitives
- Lucide icons

## Data visualization and tables

- Recharts for charts
- TanStack Table for data table behavior

## Forms and rich content

- TipTap rich text editor
- React Day Picker for date inputs
- React Hook Form + Zod + `@hookform/resolvers`
- `src/lib/forms` CRUD kit (`useCrudForm`, `FormDialog`, `runAction`)

## i18n

- `next-intl` (`en` / `ar`, always-prefixed locales)

## UX and utilities

- `next-themes` for light/dark mode
- `nextjs-toploader` for navigation progress
- `nuqs` for URL query state management
- `sonner` for toast notifications
- `sharp` for server-side image optimization
- `clsx` + `tailwind-merge` (`cn()` helper)
