"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { LimitFilter } from "@/components/shared/filters/LimitFilter"
import { Pagination } from "@/components/shared/filters/Pagination"
import { ResetFilters } from "@/components/shared/filters/ResetFilters"
import { SearchFilter } from "@/components/shared/filters/SearchFilter"
import { SelectFilter } from "@/components/shared/filters/SelectFilter"
import { MainH, SectionH } from "@/components/shared/text/Headings"

const FILTER_KEYS = ["search", "status", "limit", "page"]

function SearchParamsPreview() {
  const t = useTranslations("Filters.pages.reset")
  const searchParams = useSearchParams()
  const entries = Array.from(searchParams.entries())

  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{ t("noParamsHint") }</p>
    )
  }

  return (
    <dl className="grid gap-2 text-sm">
      { entries.map(([key, value]) => (
        <div key={ key } className="flex gap-2">
          <dt className="font-medium text-muted-foreground">{ key }:</dt>
          <dd className="font-mono" dir="ltr">{ value }</dd>
        </div>
      )) }
    </dl>
  )
}

export default function ResetFiltersPage() {
  const t = useTranslations("Filters.pages.reset")
  const tFilters = useTranslations("Filters")

  const statusOptions = [
    { label: t("statusActive"), value: "active" },
    { label: t("statusDraft"), value: "draft" },
    { label: t("statusArchived"), value: "archived" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <MainH title={ t("title") } description={ t("description") } />

      <section className="flex flex-col gap-4">
        <SectionH
          title={ t("toolbarTitle") }
          description={ t("toolbarDesc") }
        />
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex min-w-48 flex-1 flex-col gap-2">
            <span className="text-sm font-medium">{ t("searchLabel") }</span>
            <SearchFilter placeholder={ tFilters("searchProducts") } />
          </div>
          <div className="flex min-w-40 flex-col gap-2">
            <span className="text-sm font-medium">{ t("statusLabel") }</span>
            <SelectFilter
              paramKey="status"
              options={ statusOptions }
              placeholder={ tFilters("filterByStatus") }
            />
          </div>
          <div className="flex min-w-32 flex-col gap-2">
            <span className="text-sm font-medium">{ t("limitLabel") }</span>
            <LimitFilter />
          </div>
          <ResetFilters keys={ FILTER_KEYS } />
        </div>
        <Pagination pages={ 10 } />
      </section>

      <section className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
        <SectionH
          title={ t("currentParamsTitle") }
          description={ t("currentParamsDesc") }
        />
        <SearchParamsPreview />
      </section>
    </div>
  )
}
