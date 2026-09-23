"use client"

import { useTranslations } from "next-intl"

import { MetricCard } from "./MetricCard"

export type KpiCardProps = {
  title: string
  value: string
  change: string
  trend: "up" | "down"
}

/** Demo-friendly wrapper around MetricCard. Prefer MetricCard in new screens. */
export function KpiCard({ title, value, change, trend }: KpiCardProps) {
  const t = useTranslations("Common")

  return (
    <MetricCard
      title={title}
      value={<span dir="ltr">{value}</span>}
      trend={trend}
      description={`${change} ${t("fromLastMonth")}`}
      className="w-full"
    />
  )
}
