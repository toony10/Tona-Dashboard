# Dashboard Feature

## Purpose

The dashboard homepage (`/en`, `/ar`) provides a guided entry point into all feature modules with a quick analytics snapshot and sample data views.

## Included capabilities

- KPI summary cards (`MetricCard`; `KpiCard` is a demo wrapper).
- Analytics preview charts.
- Feature module navigation cards.
- Recent products table snippet.
- Quick URL-synced filter demo.

## Primary building blocks

- `MetricCard` (`src/components/shared/cards/MetricCard.tsx`)
- `KpiCard` / `AnalyticsKpiCards` (demo wrappers)
- `RevenueLineChart`
- `VisitorAreaChart`
- `ProductsTable`
- `DashboardIntroFilters`

## Business value

This screen demonstrates how a production-ready admin shell can combine analytics, data, and navigation in a single landing experience.
