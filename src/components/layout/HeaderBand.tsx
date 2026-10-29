import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { HeaderScene } from "./HeaderScene";

/**
 * Tinted band at the start of the app header: holds the sidebar trigger and greeting,
 * draws the scene at its end and closes with a soft curve before the header actions.
 */
export function HeaderBand({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="header-band" className="flex h-full min-w-0 flex-1">
      <div className={ cn("flex h-full min-w-0 flex-1 items-center gap-3 bg-scene-tint ps-4 lg:ps-8", className) }>
        { children }
        <HeaderScene className="ms-auto hidden h-full w-40 shrink-0 sm:block md:w-28 lg:w-56 xl:w-90" />
      </div>
      <svg
        viewBox="0 0 64 72"
        preserveAspectRatio="none"
        aria-hidden
        focusable="false"
        className="h-full w-6 shrink-0 fill-scene-tint sm:w-16 rtl:-scale-x-100"
      >
        <path d="M0 0C36 0 28 72 64 72H0Z" />
      </svg>
    </div>
  );
}
