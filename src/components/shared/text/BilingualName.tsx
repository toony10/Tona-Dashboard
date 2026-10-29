"use client";

import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";

export type BilingualNameProps = {
  nameAr?: string | null;
  nameEn?: string | null;
  className?: string;
};

export function BilingualName({ nameAr, nameEn, className }: BilingualNameProps) {
  const locale = useLocale();
  const primary = locale === "ar" ? nameAr : nameEn;
  const secondary = locale === "ar" ? nameEn : nameAr;

  const primaryText = primary?.trim() || secondary?.trim() || "—";
  const secondaryText = secondary?.trim();
  const showSecondary = Boolean(secondaryText && secondaryText !== primaryText);

  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5 text-start", className)}>
      <span className="font-medium text-foreground">{primaryText}</span>
      {showSecondary ? (
        <span className="text-xs text-muted-foreground">{secondaryText}</span>
      ) : null}
    </div>
  );
}
