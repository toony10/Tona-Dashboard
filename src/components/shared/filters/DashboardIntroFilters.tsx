"use client"

import { useTranslations } from "next-intl"

import { LimitFilter } from "@/components/shared/filters/LimitFilter"
import { ResetFilters } from "@/components/shared/filters/ResetFilters"
import { SearchFilter } from "@/components/shared/filters/SearchFilter"

export function DashboardIntroFilters() {
  const t = useTranslations("Filters")

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <SearchFilter
        placeholder={ t("searchProducts") }
        className="sm:min-w-56"
      />
      <LimitFilter className="sm:w-40" />
      <ResetFilters keys={ ["search", "limit"] } />
    </div>
  )
}
