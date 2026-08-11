# API Reference: Constants

## File

- `src/config/constants.ts`

## Exports

- `SEARCH_FILTER_URL_UPDATE_DELAY_MS: number`
  - Debounce delay for search/text filter URL updates.
  - Current value: `500` milliseconds.
- `FILTER_URL_UPDATE_DELAY_MS: number`
  - Debounce delay for non-search URL-based filter updates (select, tabs, date, limit, pagination, etc.).
  - Current value: `100` milliseconds.
- `DEFAULT_PAGE: number`
  - Default page number for list queries.
- `DEFAULT_LIMIT: number`
  - Default page size for list queries.

## Usage guidance

- Use `SEARCH_FILTER_URL_UPDATE_DELAY_MS` for text/search filters so typing stays responsive without flooding the server.
- Use `FILTER_URL_UPDATE_DELAY_MS` for discrete filter controls that typically change once per user action.
