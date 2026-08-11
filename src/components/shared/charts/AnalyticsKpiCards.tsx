"use client"

import { useTranslations } from "next-intl"

import { KpiCard } from "@/components/shared/cards/KpiCard"
import { kpiStats } from "@/lib/chart-data"

export function AnalyticsKpiCards() {
  const t = useTranslations("Charts")

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      { kpiStats.map((stat) => (
        <KpiCard
          key={ stat.key }
          title={ t(`kpi.${ stat.key }Title`) }
          value={ stat.value }
          change={ stat.change }
          trend={ stat.trend }
        />
      )) }
    </div>
  )
}
