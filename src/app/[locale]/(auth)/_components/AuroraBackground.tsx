import { cn } from "@/lib/utils";

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={ cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      ) }
    >
      <div className="absolute inset-0 bg-background" />

      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />

      <div className="absolute inset-0 bg-background/60 dark:bg-background/40" />
    </div>
  );
}
