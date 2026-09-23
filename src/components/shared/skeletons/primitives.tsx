import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function Breadcrumb_SK({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className={index === 0 ? "h-4 w-16" : "h-4 w-24"}
        />
      ))}
    </div>
  );
}

export function PageHeading_SK({
  showDescription = false,
  className,
}: {
  showDescription?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Skeleton className="h-8 w-48" />
      {showDescription ? <Skeleton className="h-4 w-80 max-w-full" /> : null}
    </div>
  );
}

export function Toolbar_SK({
  slots = 4,
  className,
}: {
  slots?: number;
  className?: string;
}) {
  const extraSlots = Math.max(slots - 1, 0);

  return (
    <div className={cn("flex flex-nowrap items-center gap-3", className)}>
      <Skeleton className="h-10 min-w-0 flex-1" />
      {Array.from({ length: extraSlots }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-28 shrink-0" />
      ))}
    </div>
  );
}

export function Pagination_SK({ className }: { className?: string }) {
  return <Skeleton className={cn("mx-auto h-10 w-64", className)} />;
}

export function DataTable_SK({
  columns = 5,
  rows = 10,
  className,
}: {
  columns?: number;
  rows?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("overflow-hidden rounded-lg border bg-card", className)}
    >
      <div className="flex h-12 items-center gap-4 border-b border-primary-foreground/20 bg-primary px-5">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-4 max-w-28 flex-1 bg-primary-foreground/25"
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex h-14 items-center gap-4 border-b border-border/70 px-5 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className="h-4 max-w-40 flex-1 bg-primary/10"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function NavCards_SK({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <section className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-xl border-2 border-border bg-background p-5"
        >
          <Skeleton className="size-10 rounded-md" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </section>
  );
}

export function DetailHeader_SK({
  actionCount = 3,
  className,
}: {
  actionCount?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 shrink-0 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: actionCount }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-24" />
        ))}
      </div>
    </div>
  );
}

export function FieldsGrid_SK({
  fields = 4,
  className,
}: {
  fields?: number;
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-36" />
        </div>
      ))}
    </dl>
  );
}
