# Table Feature

## Purpose

The table module demonstrates a reusable, sortable data table implementation suitable for admin datasets.

## Route

- `/table`

## Included capabilities

- Column-based sorting.
- Typed row data model.
- Custom formatting for product fields.
- Pagination control example.
- Skeleton rows during explicit loading and URL-driven server navigation.

## Primary building blocks

- `ProductsTable`
- `DataTable`
- `Pagination`

## Technical foundation

The table experience is built on TanStack Table and styled through shared shadcn/ui primitives.

`DataTable` renders its loading body when either its `isLoading` prop is true or
the dashboard's shared query-navigation transition is pending. This keeps table
loading behavior consistent across filterable dashboard pages without requiring
each page to manage a separate loading state.
