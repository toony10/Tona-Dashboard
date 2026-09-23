import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type MetricCardProps = {
  title: string;
  value: ReactNode;
  icon?: ReactNode;
  trend?: "up" | "down";
  description?: string;
  className?: string;
};

export function MetricCard({
  title,
  value,
  icon,
  trend,
  description,
  className,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "w-[244px] flex-row items-start gap-4 overflow-visible rounded-xl border-2 border-border bg-background p-5 shadow-xs ring-0",
        className,
      )}
    >
      {icon ? (
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background shadow-xs">
          <span className="flex size-4 items-center justify-center text-muted-foreground [&>svg]:size-4">
            {icon}
          </span>
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold leading-[22px] text-primary">
            {value}
          </div>
          {trend === "up" ? (
            <TrendingUp className="size-4 shrink-0 text-primary" />
          ) : trend === "down" ? (
            <TrendingDown className="size-4 shrink-0 text-destructive" />
          ) : null}
        </div>
        {description ? (
          <p
            className={cn(
              "text-xs",
              trend === "up"
                ? "text-primary"
                : trend === "down"
                  ? "text-destructive"
                  : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
