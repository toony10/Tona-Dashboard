import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SelectFilter_SK({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn("h-8 w-40 min-w-40 shrink-0 rounded-lg", className)}
    />
  );
}
