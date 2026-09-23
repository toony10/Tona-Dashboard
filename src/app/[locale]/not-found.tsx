import { getLocale, getTranslations } from "next-intl/server";

import { NotFoundPage } from "@/components/shared/not-found";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Common.notFound" });

  return (
    <>
      <title>{t("title")}</title>
      <NotFoundPage />
    </>
  );
}
