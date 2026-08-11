# Filters Feature

## Purpose

The filters module demonstrates composable controls that synchronize state with URL query parameters, making views shareable and navigable.

## Routes

- `/filters`
- `/filters/pagination`
- `/filters/select`
- `/filters/multiple-select`
- `/filters/tabs`
- `/filters/date`
- `/filters/search`
- `/filters/limit`
- `/filters/reset`

## Included capabilities

- Search query synchronization.
- Single and multi-select filtering.
- Tab-based segmentation.
- Date-based filtering.
- Page-size limiting and pagination controls.
- One-click reset for selected params.
- Automatic table loading feedback during server-side filter updates.

## Primary building blocks

- `SearchFilter`
- `SelectFilter`
- `MultipleSelectFilter`
- `TabsFilter`
- `DateFilter`
- `LimitFilter`
- `Pagination`
- `ResetFilters`

## Technical notes

Filter updates are debounced and URL-driven to support refresh-safe state and deep-linking behavior. Search uses a `500ms` debounce (`SEARCH_FILTER_URL_UPDATE_DELAY_MS`); other filters use `100ms` (`FILTER_URL_UPDATE_DELAY_MS`).

Dashboard filters pass a shared React transition to `nuqs`. While a
non-shallow query update is waiting for its Server Component response,
filterable tables display skeleton rows and pagination is temporarily disabled.
See `guides/state-and-url-filters.md` for the lifecycle and extension pattern.
