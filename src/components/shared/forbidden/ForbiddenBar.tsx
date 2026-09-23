"use client";

import { ShieldOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export type ForbiddenBarProps = {
  className?: string;
};

export function ForbiddenBar({ className }: ForbiddenBarProps) {
  const t = useTranslations("Common.forbidden");

  return (
    <div
      role="alert"
      aria-label={t("title")}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-foreground",
        className,
      )}
    >
      <ShieldOff
        className="mt-0.5 size-4 shrink-0 text-destructive"
        aria-hidden
      />
      <p className="text-start text-muted-foreground">{t("description")}</p>
    </div>
  );
}
