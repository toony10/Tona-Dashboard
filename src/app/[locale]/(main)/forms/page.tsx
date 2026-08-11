import { getTranslations, setRequestLocale } from "next-intl/server";

import { AppLink } from "@/components/shared/navigation/AppLink";
import { MainH } from "@/components/shared/text/Headings";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** `key` resolves to `Forms.cards.{key}`. */
const formPages = [
  { key: "richText", href: "/forms/rich-text" },
  { key: "imageUploader", href: "/forms/image-uploader" },
  { key: "fileUploader", href: "/forms/file-uploader" },
  { key: "dateInput", href: "/forms/date-input" },
] as const;

type FormsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function FormsPage({ params }: FormsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Forms" });

  return (
    <div className="flex flex-col gap-8">
      <MainH
        title={ t("index.title") }
        description={ t("index.description") }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        { formPages.map((page) => (
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
  );
}
