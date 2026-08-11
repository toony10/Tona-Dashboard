# Components

## Component layers

- `src/components/ui`: foundational, reusable UI primitives.
- `src/components/layout`: app shell pieces (sidebar, header, nav).
- `src/components/shared`: feature-specific reusable components.
- `src/components/auth`: authentication screen components.
- `src/components/providers`: app-level context providers.

## Key shared modules

- Charts: KPI cards and Recharts-based visualizations.
- Filters: URL-synced controls (search, select, date, tabs, reset).
- Forms: rich text, image/file uploaders, date inputs.
- Table: reusable data table and product table examples.
- Text helpers: consistent page and section headings.

## Best practices

- Keep domain logic in `shared` components and pages thin.
- Prefer extending existing `ui` components before adding new primitives.
- Reuse heading and card patterns for visual consistency.
