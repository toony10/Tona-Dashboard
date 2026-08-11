import { getTranslations, setRequestLocale } from "next-intl/server";

import { FileUploader } from "@/components/shared/forms/FileUploader";
import { MainH } from "@/components/shared/text/Headings";

type FileUploaderPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function FileUploaderPage({
  params,
}: FileUploaderPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "Forms.pages.fileUploader",
  });

  return (
    <div className="flex flex-col gap-6">
      <MainH title={ t("title") } description={ t("description") } />
      <FileUploader />
    </div>
  );
}
