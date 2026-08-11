import { getTranslations, setRequestLocale } from "next-intl/server"

import { MainH } from "@/components/shared/text/Headings"
import { AnalyticsKpiCards } from "@/components/shared/charts/AnalyticsKpiCards"
import { ConversionRadialChart } from "@/components/shared/charts/ConversionRadialChart"
import { RevenueLineChart } from "@/components/shared/charts/RevenueLineChart"
import { SalesBarChart } from "@/components/shared/charts/SalesBarChart"
import { TopProductsChart } from "@/components/shared/charts/TopProductsChart"
import { TrafficSourcesChart } from "@/components/shared/charts/TrafficSourcesChart"
import { VisitorAreaChart } from "@/components/shared/charts/VisitorAreaChart"

type AnalyticsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({
    locale,
    namespace: "Charts.pages.analytics",
  })

  return (
    <div className="flex flex-col gap-8">
      <MainH title={ t("title") } description={ t("description") } />
      <AnalyticsKpiCards />
      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueLineChart />
        <VisitorAreaChart />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <SalesBarChart />
        <TopProductsChart />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <TrafficSourcesChart />
        <ConversionRadialChart />
      </div>
    </div>
  )
}
