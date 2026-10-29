# Components

## Component layers

- `src/components/ui`: foundational, reusable UI primitives (including breadcrumb, label, input-otp).
- `src/components/layout`: app shell pieces. The sidebar holds a full-width logo (it shrinks to the mark when collapsed), `GlobalSearch` (⌘K), `NavMain` with a sliding active pill (`SidebarMenuIndicator`) and `NavUser`. The header is a tinted `HeaderBand` (sidebar trigger, greeting, date, `HeaderScene` illustration) followed by locale, theme and notification buttons.
- `src/components/shared`: feature-specific reusable components.
- `src/components/forms/auth`: login form (`Login_FR`).
- `src/components/providers`: app-level context providers (`ThemeProvider`, `QueryNavigationProvider`, `TopLoader`, appearance).

## Key shared modules

- Auth: `AuthShell` (split card: form on one side, `AuthIllustration` panel on the other) in `shared/auth`.
- Charts: `MetricCard` (tonal icon tile via `tone`: `primary` | `violet` | `mint` | `amber`; KPI demo wraps it) and Recharts-based visualizations.
- Filters: URL-synced controls (search default param is `search`, select, date, tabs, reset).
- Forms: rich text, image/file uploaders, date inputs.
- Table: reusable data table with optional per-row selection, plus a product table example.
- Text: `MainH` / `SectionH`, `BilingualName`, `HtmlContent`.
- Status: `StatusIndicator` + `statusTone()` (pill chip on the tone's container color).
- Navigation: `AppLink`, `BreadCrumb`.
- Sidebar motion: `sidebar-label` (fade out on collapse, fade in once expanded) and `sidebar-reveal` utilities in `globals.css` keep text from being cut by the animating edge.
- Brand: `Logo` (mark + wordmark; the wordmark uses the text color, so one logo serves light and dark), `LogoMin` (mark only, for tight spots), built from `LogoMark` / `LogoWordmark`. Static copies live in `public/assets/images/logo/` and the favicon set in `src/app/` (`favicon.ico`, `icon.svg`, `apple-icon.png`).
- Feedback: `ErrorPage` / `ErrorBar` / `ErrorHandler`, `ForbiddenPage` / `ForbiddenBar`, `NotFoundPage`.
- Skeletons: `ListPage_SK`, `DetailsPage_SK`, `HubPage_SK`, `SelectFilter_SK`.
- Actions: `actionButtonVariant` (`primary` | `secondary` | `destroy`).

## Best practices

- Keep domain logic in `shared` components and pages thin.
- Prefer extending existing `ui` components before adding new primitives.
- Reuse heading, breadcrumb, skeleton, and card patterns for visual consistency.
- Entity CRUD uses `src/lib/forms` (`FormDialog` / `ConfirmDialog` / `useCrudForm`), not a second dialog API.
