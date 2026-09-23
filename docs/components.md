# Components

## Component layers

- `src/components/ui`: foundational, reusable UI primitives (including breadcrumb, label, input-otp).
- `src/components/layout`: app shell pieces (sidebar, header, nav). Header is locale + theme only; `GlobalSearch` still exists but is not mounted.
- `src/components/shared`: feature-specific reusable components.
- `src/components/forms/auth`: login form (`Login_FR`).
- `src/components/providers`: app-level context providers (`ThemeProvider`, `QueryNavigationProvider`, `TopLoader`, appearance).

## Key shared modules

- Charts: `MetricCard` (KPI demo wraps it) and Recharts-based visualizations.
- Filters: URL-synced controls (search default param is `search`, select, date, tabs, reset).
- Forms: rich text, image/file uploaders, date inputs.
- Table: reusable data table with optional per-row selection, plus a product table example.
- Text: `MainH` / `SectionH`, `BilingualName`, `HtmlContent`.
- Status: `StatusIndicator` + `statusTone()`.
- Navigation: `AppLink`, `BreadCrumb`.
- Feedback: `ErrorPage` / `ErrorBar` / `ErrorHandler`, `ForbiddenPage` / `ForbiddenBar`, `NotFoundPage`.
- Skeletons: `ListPage_SK`, `DetailsPage_SK`, `HubPage_SK`, `SelectFilter_SK`.
- Actions: `actionButtonVariant` (`primary` | `secondary` | `destroy`).

## Best practices

- Keep domain logic in `shared` components and pages thin.
- Prefer extending existing `ui` components before adding new primitives.
- Reuse heading, breadcrumb, skeleton, and card patterns for visual consistency.
- Entity CRUD uses `src/lib/forms` (`FormDialog` / `ConfirmDialog` / `useCrudForm`), not a second dialog API.
