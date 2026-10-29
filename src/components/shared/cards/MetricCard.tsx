import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type MetricCardTone = "primary" | "violet" | "mint" | "amber";

export type MetricCardProps = {
  title: string;
  value: ReactNode;
  icon?: ReactNode;
  /** Icon tile color. The management app renders every tile in primary for a calmer page. */
  tone?: MetricCardTone;
  trend?: "up" | "down";
  description?: string;
  className?: string;
};

const toneClassName: Record<MetricCardTone, string> = {
  primary: "[--tone-bg:var(--primary-container)] [--tone-fg:var(--on-primary-container)]",
  violet: "[--tone-bg:var(--secondary-container)] [--tone-fg:var(--on-secondary-container)]",
  mint: "[--tone-bg:var(--success-container)] [--tone-fg:var(--on-success-container)]",
  amber: "[--tone-bg:var(--warning-container)] [--tone-fg:var(--on-warning-container)]",
};

export function MetricCard({
  title,
  value,
  icon,
  tone = "primary",
  trend,
  description,
  className,
}: MetricCardProps) {
  return (
    <Card className={ cn("w-[244px] gap-3.5 px-5 py-4.5", className) }>
      <div className="flex items-center gap-3">
        { icon ? (
          <span
            data-slot="metric-icon"
            className={ cn(
              "icon-tile flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--tone-bg) text-(--tone-fg) [&>svg]:size-5",
              toneClassName[tone],
            ) }
          >
            { icon }
          </span>
        ) : null }
        <p className="min-w-0 text-sm font-medium text-muted-foreground">{ title }</p>
      </div>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <div className="text-3xl leading-tight font-semibold tracking-tight text-foreground tabular-nums">
          { value }
        </div>
        { trend || description ? (
          <span
            className={ cn(
              "inline-flex h-5.5 items-center gap-1 rounded-md px-2 text-xs font-medium",
              trend === "up"
                ? "bg-success-container text-on-success-container"
                : trend === "down"
                  ? "bg-destructive-container text-on-destructive-container"
                  : "bg-muted text-muted-foreground",
            ) }
          >
            { trend === "up" ? (
              <TrendingUp className="size-3.5 shrink-0" />
            ) : trend === "down" ? (
              <TrendingDown className="size-3.5 shrink-0" />
            ) : null }
            { description }
          </span>
        ) : null }
      </div>
    </Card>
  );
}
