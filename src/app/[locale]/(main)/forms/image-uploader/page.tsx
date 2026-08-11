import { getTranslations, setRequestLocale } from "next-intl/server";

import { ImageUploader } from "@/components/shared/forms/ImageUploader";
import { MainH } from "@/components/shared/text/Headings";

type ImageUploaderPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ImageUploaderPage({
  params,
}: ImageUploaderPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "Forms.pages.imageUploader",
  });

  return (
    <div className="flex flex-col gap-6">
      <MainH title={ t("title") } description={ t("description") } />
      <ImageUploader />
    </div>
  );
}
