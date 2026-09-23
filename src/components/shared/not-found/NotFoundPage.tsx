"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo/Logo";
import { AppLink } from "@/components/shared/navigation/AppLink";
import { MainH } from "@/components/shared/text/Headings";

export function NotFoundPage() {
  const t = useTranslations("Common.notFound");

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Logo width={180} height={40} />
        <MainH title={t("title")} description={t("description")} />
        <Button asChild size="lg">
          <AppLink href="/">{t("backHome")}</AppLink>
        </Button>
      </div>
    </main>
  );
}
