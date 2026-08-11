"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { TabsFilter } from "@/components/shared/filters/TabsFilter"
import { MainH, SectionH } from "@/components/shared/text/Headings"
import { FILTER_URL_UPDATE_DELAY_MS } from "@/config/constants"

/** `key` resolves to `Filters.options.{key}`. */
const statusOptions = [
  { key: "active", value: "active" },
  { key: "inactive", value: "inactive" },
  { key: "pending", value: "pending" },
  { key: "archived", value: "archived" },
]

const categoryOptions = [
  { key: "electronics", value: "electronics" },
  { key: "clothing", value: "clothing" },
  { key: "books", value: "books" },
  { key: "homeGarden", value: "home-garden" },
]

const priorityOptions = [
  { key: "low", value: "low" },
  { key: "medium", value: "medium" },
  { key: "high", value: "high" },
  { key: "urgent", value: "urgent" },
]

function SearchParamsPreview() {
  const t = useTranslations("Filters.pages.tabs")
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

export default function TabsFilterPage() {
  const t = useTranslations("Filters.pages.tabs")
  const tFilters = useTranslations("Filters")

  const toOptions = (options: { key: string; value: string }[]) =>
    options.map((option) => ({
      label: tFilters(`options.${ option.key }`),
      value: option.value,
    }))

  return (
    <div className="flex flex-col gap-8">
      <MainH title={ t("title") } description={ t("description") } />

      <div className="grid gap-8">
        <section className="flex flex-col gap-3">
          <SectionH
            title={ t("statusTitle") }
            description={ t("statusDesc") }
          />
          <TabsFilter paramKey="status" options={ toOptions(statusOptions) } />
        </section>

        <section className="flex flex-col gap-3">
          <SectionH
            title={ t("categoryTitle") }
            description={ t("categoryDesc") }
          />
          <TabsFilter
            paramKey="category"
            options={ toOptions(categoryOptions) }
          />
        </section>

        <section className="flex flex-col gap-3">
          <SectionH
            title={ t("priorityTitle") }
            description={ t("priorityDesc") }
          />
          <TabsFilter
            paramKey="priority"
            options={ toOptions(priorityOptions) }
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
