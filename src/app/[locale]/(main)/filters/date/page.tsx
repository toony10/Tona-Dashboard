"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { DateFilter } from "@/components/shared/filters/DateFilter"
import { ResetFilters } from "@/components/shared/filters/ResetFilters"
import { MainH, SectionH } from "@/components/shared/text/Headings"
import { FILTER_URL_UPDATE_DELAY_MS } from "@/config/constants"

function SearchParamsPreview() {
  const t = useTranslations("Filters.pages.date")
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

export default function DateFilterPage() {
  const t = useTranslations("Filters.pages.date")

  return (
    <div className="flex flex-col gap-8">
      <MainH title={ t("title") } description={ t("description") } />

      <div className="grid gap-8 md:grid-cols-2">
        <section className="flex flex-col gap-3">
          <SectionH title={ t("fromTitle") } description={ t("fromDesc") } />
          <DateFilter
            paramKey="from"
            placeholder={ t("startDatePlaceholder") }
          />
        </section>

        <section className="flex flex-col gap-3">
          <SectionH title={ t("toTitle") } description={ t("toDesc") } />
          <DateFilter paramKey="to" placeholder={ t("endDatePlaceholder") } />
        </section>
      </div>

      <div className="flex items-center gap-3">
        <ResetFilters keys={ ["from", "to"] } />
      </div>

      <section className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
        <SectionH
          title={ t("currentParamsTitle") }
          description={ t("currentParamsDesc", {
            ms: FILTER_URL_UPDATE_DELAY_MS,
          }) }
        />
        <SearchParamsPreview />
      </section>
    </div>
  )
}
