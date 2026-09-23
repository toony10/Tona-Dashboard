"use client"

import { useTranslations } from "next-intl"

import { MetricCard } from "@/components/shared/cards/MetricCard"
import { kpiStats } from "@/lib/chart-data"

export function AnalyticsKpiCards() {
  const t = useTranslations("Charts")
  const tCommon = useTranslations("Common")

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      { kpiStats.map((stat) => (
        <MetricCard
          key={ stat.key }
          title={ t(`kpi.${ stat.key }Title`) }
          value={ <span dir="ltr">{ stat.value }</span> }
          trend={ stat.trend }
          description={ `${ stat.change } ${ tCommon("fromLastMonth") }` }
          className="w-full"
        />
      )) }
    </div>
  )
}
