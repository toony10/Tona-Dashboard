import { getTranslations, setRequestLocale } from "next-intl/server";

import { Pagination } from "@/components/shared/filters/Pagination";
import { MainH } from "@/components/shared/text/Headings";

type PaginationPageProps = {
    params: Promise<{ locale: string }>;
};

export default async function PaginationPage({ params }: PaginationPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: "Filters.pages.pagination" });

    return (
        <div className="flex flex-col gap-6">
            <MainH title={ t("title") } description={ t("description") } />
            <Pagination />
        </div>
    )
}
