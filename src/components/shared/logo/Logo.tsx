"use client";

import { useTranslations } from "next-intl";

import { AppLink } from "@/components/shared/navigation/AppLink";
import { useIsRtl } from "@/hooks/use-translated-navigation";
import { cn } from "@/lib/utils";

import { LogoMark, LogoWordmark } from "./LogoMark";

/** Lockup proportions: 40-unit mark, 10-unit gap, 100-unit wordmark. */
const LOCKUP_ASPECT = 150 / 40;

type LogoProps = {
    /** Box the lockup fits into; it keeps its aspect ratio. Ignored when `fill` is set. */
    width?: number;
    height?: number;
    /** Stretch to the container's width (height follows the aspect ratio). */
    fill?: boolean;
    className?: string;
    wordmarkClassName?: string;
    alt?: string;
};

/**
 * One logo for light and dark: the mark keeps the brand colors, the wordmark uses the text color.
 * The mark leads on the start side, so in RTL it sits on the right.
 */
export function Logo({
    width = 140,
    height = 40,
    fill = false,
    className,
    wordmarkClassName,
    alt,
}: LogoProps) {
    const t = useTranslations("Common");
    const rtl = useIsRtl();
    const altText = alt ?? t("logoAlt");
    const lockupHeight = Math.min(height, width / LOCKUP_ASPECT);

    return (
        <AppLink href="/"
            aria-label={ altText }
            className={ cn("block shrink-0 text-foreground", fill && "w-full", className) }
            style={ fill ? undefined : { width: lockupHeight * LOCKUP_ASPECT, height: lockupHeight } }
        >
            <svg viewBox="0 0 150 40" aria-hidden focusable="false" className="block h-auto w-full overflow-visible">
                <LogoMark x={ rtl ? 110 : 0 } width={ 40 } height={ 40 } />
                <LogoWordmark x={ rtl ? 0 : 50 } width={ 100 } height={ 40 } className={ wordmarkClassName } />
            </svg>
        </AppLink>
    );
}
