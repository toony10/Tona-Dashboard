import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { statusTone, type StatusTone } from "./status-tone";

const statusIndicatorVariants = cva(
  "inline-flex items-center gap-1.5 font-semibold",
  {
    variants: {
      tone: {
        success: "text-status-success",
        warning: "text-status-warning",
        danger: "text-status-danger",
        info: "text-status-info",
        neutral: "text-status-neutral",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "md",
    },
  },
);

const statusDotVariants = cva("shrink-0 rounded-full bg-current ring-2 ring-current/20", {
  variants: {
    size: {
      sm: "size-1.5",
      md: "size-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type StatusIndicatorProps = {
  /** Already-translated label (this component does not call i18n). */
  label: string;
  /** Backend status (`ACTIVE`, `draft`, …). Used when `tone` is omitted. */
  status?: string | null;
  tone?: StatusTone;
  className?: string;
} & VariantProps<typeof statusIndicatorVariants>;

export function StatusIndicator({
  label,
  status,
  tone,
  size = "md",
  className,
}: StatusIndicatorProps) {
  const resolvedTone = tone ?? statusTone(status);

  return (
    <span className={cn(statusIndicatorVariants({ tone: resolvedTone, size }), className)}>
      <span className={statusDotVariants({ size })} aria-hidden />
      {label}
    </span>
  );
}
