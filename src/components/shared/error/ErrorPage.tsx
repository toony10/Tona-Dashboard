"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { actionButtonVariant } from "@/components/shared/actions/action-button-variant";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo/Logo";
import { AppLink } from "@/components/shared/navigation/AppLink";
import { MainH } from "@/components/shared/text/Headings";

export type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
  /** Dashboard main area (below header); default is full viewport. */
  inset?: boolean;
  className?: string;
};

export function ErrorPage({
  error,
  reset,
  inset = false,
  className,
}: ErrorPageProps) {
  const t = useTranslations("Common.error");
  const tMeta = useTranslations("Metadata");

  useEffect(() => {
    console.error(error);
  }, [error]);

  useEffect(() => {
    document.title = `${tMeta("appName")} - ${t("title")}`;
  }, [t, tMeta]);

  return (
    <main
      className={cn(
        "flex w-full flex-col items-center justify-center px-6 py-12",
        inset ? "h-full min-h-[calc(100vh-8rem)] flex-1" : "min-h-svh",
        className,
      )}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Logo width={180} height={40} />
        <MainH title={t("title")} description={t("description")} />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={reset}>
            {t("retry")}
          </Button>
          <Button asChild size="lg" variant={actionButtonVariant.secondary}>
            <AppLink href="/">{t("backHome")}</AppLink>
          </Button>
        </div>
      </div>
    </main>
  );
}
