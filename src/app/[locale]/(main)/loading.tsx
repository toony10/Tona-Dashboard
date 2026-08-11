"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("Common");

  return (
    <div className="flex h-full min-h-[calc(100vh-8rem)] w-full flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {t("loading")}
        </p>
      </div>
    </div>
  );
}
