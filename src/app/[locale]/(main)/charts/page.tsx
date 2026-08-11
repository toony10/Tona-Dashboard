import { getTranslations, setRequestLocale } from "next-intl/server"

import { AppLink } from "@/components/shared/navigation/AppLink"
import { MainH } from "@/components/shared/text/Headings"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/** `key` resolves to `Charts.cards.{key}`. */
const chartPages = [
  { key: "analyticsDashboard", href: "/charts/analytics" },
] as const

type ChartsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function ChartsPage({ params }: ChartsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "Charts" })

  return (
    <div className="flex flex-col gap-8">
      <MainH
        title={ t("index.title") }
        description={ t("index.description") }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        { chartPages.map((page) => (
          <AppLink key={ page.href } href={ page.href }>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle>{ t(`cards.${ page.key }.title`) }</CardTitle>
                <CardDescription>
                  { t(`cards.${ page.key }.description`) }
                </CardDescription>
              </CardHeader>
            </Card>
          </AppLink>
        )) }
      </div>
    </div>
  )
}
