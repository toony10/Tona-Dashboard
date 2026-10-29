"use client";

import { useTranslations } from "next-intl";

import { AppLink } from "@/components/shared/navigation/AppLink";
import { cn } from "@/lib/utils";

import { LogoMark } from "./LogoMark";

type LogoMinProps = {
    size?: number;
    className?: string;
    alt?: string;
};

/** Square mark used where the full logo does not fit (collapsed sidebar). */
export function LogoMin({ size = 28, className, alt }: LogoMinProps) {
    const t = useTranslations("Common");
    const altText = alt ?? t("logoAlt");

    return (
        <AppLink href="/"
            aria-label={ altText }
            className={ cn("relative inline-flex shrink-0", className) }
        >
            <LogoMark style={ { width: size, height: size } } />
        </AppLink>
    );
}
