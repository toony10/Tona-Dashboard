import { Moon, Palette } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { AppLink } from "@/components/shared/navigation/AppLink"
import { MainH } from "@/components/shared/text/Headings"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/** `key` resolves to `Settings.cards.{key}`. */
const settingsPages = [
  { key: "darkTheme", href: "/settings/dark-theme", icon: Moon },
] as const

type SettingsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "Settings" })

  return (
    <div className="flex flex-col gap-8">
      <MainH
        title={ t("index.title") }
        description={ t("index.description") }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        { settingsPages.map((page) => (
          <AppLink key={ page.href } href={ page.href }>
            <Card className="group h-full overflow-hidden transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <page.icon className="size-5" />
                </div>
                <CardTitle>{ t(`cards.${ page.key }.title`) }</CardTitle>
                <CardDescription>
                  { t(`cards.${ page.key }.description`) }
                </CardDescription>
              </CardHeader>
            </Card>
          </AppLink>
        )) }
        <Card className="h-full border-dashed bg-muted/20">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Palette className="size-5" />
            </div>
            <CardTitle className="text-muted-foreground">
              { t("moreSettings.title") }
            </CardTitle>
            <CardDescription>{ t("moreSettings.description") }</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
