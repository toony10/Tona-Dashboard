import type { ReactNode } from "react";

import AnimationWrapper from "@/components/shared/animations/AnimationWrapper";
import { Logo } from "@/components/shared/logo/Logo";

import { AuthIllustration } from "./AuthIllustration";

export type AuthShellProps = {
  children: ReactNode;
  illustrationLabel: string;
  headerEnd?: ReactNode;
  /** Short explanation of the workspace shown beside the form on wide screens. */
  context?: ReactNode;
};

/**
 * Focused entry layout for authentication screens.
 * Forms own their content; this shell owns responsive geometry, brand, and visual context.
 */
export function AuthShell({
  children,
  illustrationLabel,
  headerEnd,
  context,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-full flex-col overflow-x-hidden">
      <div className="flex min-h-svh flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="grid w-full max-w-md overflow-hidden rounded-[1.75rem] border border-border/60 bg-transparent shadow-[0_24px_70px_-32px_color-mix(in_srgb,var(--foreground)_45%,transparent)] ring-1 ring-foreground/5 lg:min-h-[38rem] lg:max-w-6xl lg:grid-cols-[minmax(0,15fr)_minmax(0,11fr)]">
          <AnimationWrapper className="relative flex min-h-0 flex-col bg-card px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
            <div className="relative z-10 flex shrink-0 items-center justify-between gap-4">
              <Logo width={ 140 } height={ 36 } />
              { headerEnd ? <div className="flex shrink-0 items-center gap-2">{ headerEnd }</div> : null }
            </div>
            <div className="relative z-10 min-h-0 flex-1 overflow-x-hidden">
              <div className="flex min-h-full flex-col justify-center py-10 lg:py-8">{ children }</div>
            </div>
          </AnimationWrapper>

          <aside className="relative hidden min-h-0 overflow-hidden bg-primary-container lg:block" aria-label={ illustrationLabel }>
            <div aria-hidden className="absolute -end-24 -top-24 size-72 rounded-full border-[2rem] border-secondary/20" />
            <div aria-hidden className="absolute -bottom-20 -start-16 size-64 rounded-full bg-primary/25 blur-3xl" />
            <div className="relative flex h-full min-h-0 flex-col items-center justify-center gap-6 p-8 xl:p-10">
              <AnimationWrapper initial={ { opacity: 0 } } whileInView={ { opacity: 1 } } className="w-full max-w-[min(100%,24rem)]">
                <AuthIllustration />
              </AnimationWrapper>
              { context ? <div className="max-w-sm text-center text-sm leading-relaxed text-on-primary-container/80">{ context }</div> : null }
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
