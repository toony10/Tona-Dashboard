import { ArrowRight } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { DashboardIntroFilters } from "@/components/shared/filters/DashboardIntroFilters"
import { AnalyticsKpiCards } from "@/components/shared/charts/AnalyticsKpiCards"
import { RevenueLineChart } from "@/components/shared/charts/RevenueLineChart"
import { VisitorAreaChart } from "@/components/shared/charts/VisitorAreaChart"
import { AppLink } from "@/components/shared/navigation/AppLink"
import { ProductsTable, type Product } from "@/components/shared/table/ProductsTable"
import { MainH, SectionH } from "@/components/shared/text/Headings"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { navigation, type NavItem } from "@/config/navigation"

const recentProducts: Product[] = [
  {
    id: "PRD-001",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 129.99,
    status: "active",
  },
  {
    id: "PRD-002",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    price: 349.0,
    status: "active",
  },
  {
    id: "PRD-003",
    name: "Stainless Water Bottle",
    category: "Accessories",
    price: 24.5,
    status: "draft",
  },
  {
    id: "PRD-004",
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 89.99,
    status: "active",
  },
  {
    id: "PRD-005",
    name: "Desk Lamp",
    category: "Furniture",
    price: 45.0,
    status: "archived",
  },
]

function getFeatureModules(): NavItem[] {
  return navigation.flatMap((group) =>
    group.items.filter((item) => item.url !== "/"),
  )
}

type DashboardPageProps = {
  params: Promise<{ locale: string }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "Dashboard" })
  const tCommon = await getTranslations({ locale, namespace: "Common" })
  const tNav = await getTranslations({ locale, namespace: "Nav" })
  const featureModules = getFeatureModules()

  return (
    <div className="flex flex-col gap-10">
      <MainH title={ t("title") } description={ t("description") } />

      <section className="flex flex-col gap-4">
        <AnalyticsKpiCards />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionH
            title={ t("analyticsOverviewTitle") }
            description={ t("analyticsOverviewDesc") }
          />
          <Button variant="outline" size="sm" asChild>
            <AppLink href="/charts/analytics">
              { tCommon("openAnalytics") }
              <ArrowRight className="rtl:rotate-180" />
            </AppLink>
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <RevenueLineChart />
          <VisitorAreaChart />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionH
          title={ t("exploreModulesTitle") }
          description={ t("exploreModulesDesc") }
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          { featureModules.map((module) => {
            const Icon = module.icon
            const title = tNav(module.titleKey)
            const descriptionKey = `modules.${ module.id }.description`
            const highlightsKey = `modules.${ module.id }.highlights`
            const highlights = t.has(highlightsKey)
              ? (t.raw(highlightsKey) as string[])
              : null

            return (
              <AppLink key={ module.url } href={ module.url }>
                <Card className="group h-full transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{ title }</CardTitle>
                    { t.has(descriptionKey) ? (
                      <CardDescription>{ t(descriptionKey) }</CardDescription>
                    ) : null }
                    { highlights ? (
                      <p className="pt-1 text-xs text-muted-foreground">
                        { highlights.join(" · ") }
                      </p>
                    ) : null }
                  </CardHeader>
                </Card>
              </AppLink>
            )
          }) }
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionH
            title={ t("recentProductsTitle") }
            description={ t("recentProductsDesc") }
          />
          <Button variant="outline" size="sm" asChild>
            <AppLink href="/table">
              { tCommon("viewFullTable") }
              <ArrowRight className="rtl:rotate-180" />
            </AppLink>
          </Button>
        </div>
        <ProductsTable data={ recentProducts } />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionH
            title={ t("filterToolkitTitle") }
            description={ t("filterToolkitDesc") }
          />
          <Button variant="outline" size="sm" asChild>
            <AppLink href="/filters">
              { tCommon("browseAllFilters") }
              <ArrowRight className="rtl:rotate-180" />
            </AppLink>
          </Button>
        </div>
        <Card>
          <CardHeader className="gap-4">
            <CardTitle className="text-base">
              { t("quickFilterDemoTitle") }
            </CardTitle>
            <CardDescription>{ t("quickFilterDemoDesc") }</CardDescription>
            <DashboardIntroFilters />
          </CardHeader>
        </Card>
      </section>
    </div>
  )
}
