"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { AppLink } from "@/components/shared/navigation/AppLink";
import { cn } from "@/lib/utils";

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
            className={ cn("relative shrink-0", className) }
            style={ { width: size, height: size } }
        >
            <Image
                src="/assets/images/logo-min-light.webp"
                alt={ altText }
                width={ size }
                height={ size }
                className="object-contain dark:hidden"
            />
            <Image
                src="/assets/images/logo-min-dark.webp"
                alt={ altText }
                width={ size }
                height={ size }
                className="absolute inset-0 hidden object-contain dark:block"
            />
        </AppLink>
    );
}
