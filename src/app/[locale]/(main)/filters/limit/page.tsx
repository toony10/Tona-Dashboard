"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { LimitFilter } from "@/components/shared/filters/LimitFilter"
import { MainH, SectionH } from "@/components/shared/text/Headings"
import { FILTER_URL_UPDATE_DELAY_MS } from "@/config/constants"

function SearchParamsPreview() {
  const t = useTranslations("Filters.pages.limit")
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

export default function LimitFilterPage() {
  const t = useTranslations("Filters.pages.limit")

  return (
    <div className="flex flex-col gap-8">
      <MainH title={ t("title") } description={ t("description") } />

      <div className="grid gap-8 md:grid-cols-2">
        <section className="flex flex-col gap-3">
          <SectionH
            title={ t("defaultLimitTitle") }
            description={ t("defaultLimitDesc") }
          />
          <LimitFilter />
        </section>

        <section className="flex flex-col gap-3">
          <SectionH
            title={ t("customOptionsTitle") }
            description={ t("customOptionsDesc") }
          />
          <LimitFilter
            paramKey="perPage"
            options={ [5, 15, 30, 60] }
            defaultLimit={ 15 }
          />
        </section>
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
