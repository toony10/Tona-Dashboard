# Guide: State and URL Filters

## Why URL-synced filters

URL-based state enables:

- Shareable links with active filters.
- Refresh-safe UI state.
- Better browser back/forward behavior.

## Current implementation pattern

- Filter components update query params.
- Related pages read values from URL state.
- Reset controls remove selected parameters.
- Dashboard filter updates run inside a shared React transition.
- Filterable tables show skeleton rows until the new server data is ready.

## Loading state during filter navigation

`QueryNavigationProvider` is mounted in `DashboardLayout`, so every dashboard
page shares the same filter-navigation state. It exposes:

- `startTransition`, which shared filters pass to `nuqs` when changing a query
  parameter.
- `isPending`, which remains `true` while Next.js fetches and renders the new
  Server Component response.

The request lifecycle is:

1. A filter or pagination control updates a query parameter through `nuqs`.
2. The update starts the shared React transition.
3. Because the root `NuqsAdapter` uses `shallow: false`, Next.js reruns the
   affected server page.
4. `DataTable` reads `isPending` and replaces its body with skeleton rows.
5. The server page reads the new search parameters and fetches the matching
   records.
6. Next.js commits the response, the transition completes, and the table shows
   the new rows.

Pagination is also made non-interactive and marked with `aria-busy` while the
transition is pending. Search inputs remain interactive, and their URL updates use
`SEARCH_FILTER_URL_UPDATE_DELAY_MS` (`500ms`) so each keystroke does not hit the
server. Other filters use `FILTER_URL_UPDATE_DELAY_MS` (`100ms`) for a shorter delay
on discrete controls.

`DataTable` combines the navigation state with its explicit `isLoading` prop.
This means callers can still request a loading state independently:

```tsx
const showLoading = isLoading || isPending
```

## Adding a URL-driven filter

Shared filter controls should read `startTransition` from
`useQueryNavigation()` and pass it to their `nuqs` setter:

```tsx
const { startTransition } = useQueryNavigation()

setValue(nextValue, {
  startTransition,
})
```

Use the shared `DataTable` for the results so the pending state is displayed
automatically. No page-level loading prop or provider is required for dashboard
routes.

## Practical recommendations

- Use stable query key names per module.
- Debounce search with `SEARCH_FILTER_URL_UPDATE_DELAY_MS` and other filters with
  `FILTER_URL_UPDATE_DELAY_MS`.
- Keep defaults explicit and documented.
- Avoid storing duplicate state in local component state when URL is source of truth.
- Pass the shared `startTransition` to every `nuqs` setter that triggers a
  server refetch.

## Related files

- `src/components/shared/filters/*`
- `src/components/providers/query-navigation-provider.tsx`
- `src/components/shared/table/DataTable.tsx`
- `src/components/layout/DashboardLayout.tsx`
- `src/app/layout.tsx`
- `src/config/constants.ts`
