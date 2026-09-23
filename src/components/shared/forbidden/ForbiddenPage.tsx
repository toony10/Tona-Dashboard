"use client";

import { ShieldOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/shared/navigation/AppLink";
import { MainH } from "@/components/shared/text/Headings";
import { cn } from "@/lib/utils";

export type ForbiddenPageProps = {
  homeHref?: string;
  className?: string;
};

export function ForbiddenPage({ homeHref = "/", className }: ForbiddenPageProps) {
  const t = useTranslations("Common.forbidden");

  return (
    <section
      className={cn(
        "flex min-h-[50svh] flex-col items-center justify-center px-6 py-12",
        className,
      )}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldOff className="size-7" aria-hidden />
          </div>
          <p className="font-heading text-5xl font-bold tracking-tight text-muted-foreground/50">
            {t("code")}
          </p>
        </div>
        <MainH title={t("title")} description={t("description")} />
        <Button asChild size="lg">
          <AppLink href={homeHref}>{t("backHome")}</AppLink>
        </Button>
      </div>
    </section>
  );
}
