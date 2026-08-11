import { ArrowLeft } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { DarkBackgroundPicker } from "./_components/DarkBackgroundPicker"
import { AppLink } from "@/components/shared/navigation/AppLink"
import { MainH } from "@/components/shared/text/Headings"
import { Button } from "@/components/ui/button"

type DarkThemeSettingsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function DarkThemeSettingsPage({
  params,
}: DarkThemeSettingsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({
    locale,
    namespace: "Settings.pages.darkTheme",
  })
  const tCommon = await getTranslations({ locale, namespace: "Common" })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4">
        <Button variant="ghost" size="sm" className="self-start" asChild>
          <AppLink href="/settings">
            <ArrowLeft className="size-4 rtl:rotate-180" />
            { tCommon("backToSettings") }
          </AppLink>
        </Button>
        <MainH title={ t("title") } description={ t("description") } />
      </div>
      <DarkBackgroundPicker />
    </div>
  )
}
