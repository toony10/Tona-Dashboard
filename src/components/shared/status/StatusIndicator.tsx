import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { statusTone, type StatusTone } from "./status-tone";

/** Pill chip: tonal container fill with its matching on-container text and a leading dot. */
const statusIndicatorVariants = cva(
  "inline-flex w-fit items-center gap-1.5 rounded-full font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        success: "bg-success-container text-on-success-container",
        warning: "bg-warning-container text-on-warning-container",
        danger: "bg-destructive-container text-on-destructive-container",
        info: "bg-primary-container text-on-primary-container",
        neutral: "bg-muted text-muted-foreground",
      },
      size: {
        sm: "h-5 px-2 text-[0.6875rem]",
        md: "h-6 px-2.5 text-xs",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "md",
    },
  },
);

const statusDotVariants = cva("shrink-0 rounded-full bg-current", {
  variants: {
    size: {
      sm: "size-1.5",
      md: "size-1.5",
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
    <span className={ cn(statusIndicatorVariants({ tone: resolvedTone, size }), className) }>
      <span className={ statusDotVariants({ size }) } aria-hidden />
      { label }
    </span>
  );
}
