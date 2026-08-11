import { getTranslations, setRequestLocale } from "next-intl/server";

import { AppLink } from "@/components/shared/navigation/AppLink";
import { MainH } from "@/components/shared/text/Headings";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** `key` resolves to `Filters.cards.{key}`. */
const filterPages = [
    { key: "pagination", href: "/filters/pagination" },
    { key: "select", href: "/filters/select" },
    { key: "multiSelect", href: "/filters/multiple-select" },
    { key: "tabs", href: "/filters/tabs" },
    { key: "search", href: "/filters/search" },
    { key: "date", href: "/filters/date" },
    { key: "limit", href: "/filters/limit" },
    { key: "reset", href: "/filters/reset" },
] as const;

type FiltersPageProps = {
    params: Promise<{ locale: string }>;
};

export default async function FiltersPage({ params }: FiltersPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: "Filters" });

    return (
        <div className="flex flex-col gap-8">
            <MainH
                title={ t("index.title") }
                description={ t("index.description") }
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                { filterPages.map((page) => (
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
