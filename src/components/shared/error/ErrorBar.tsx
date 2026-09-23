"use client";

import { CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export type ErrorBarProps = {
  message?: string;
  className?: string;
};

export function ErrorBar({ message, className }: ErrorBarProps) {
  const t = useTranslations("Common.error");
  const text = message?.trim() || t("title");

  return (
    <div
      role="alert"
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-foreground",
        className,
      )}
    >
      <CircleAlert
        className="mt-0.5 size-4 shrink-0 text-destructive"
        aria-hidden
      />
      <p className="text-start text-muted-foreground">{text}</p>
    </div>
  );
}
