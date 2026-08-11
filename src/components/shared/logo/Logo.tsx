"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { AppLink } from "@/components/shared/navigation/AppLink";
import { cn } from "@/lib/utils";

type LogoProps = {
    width?: number;
    height?: number;
    className?: string;
    alt?: string;
};

export function Logo({
    width = 140,
    height = 40,
    className,
    alt,
}: LogoProps) {
    const t = useTranslations("Common");
    const altText = alt ?? t("logoAlt");

    return (
        <AppLink href="/"
            className={ cn("relative shrink-0", className) }
            style={ { width, height } }
        >
            <Image
                src="/assets/images/logo-light.webp"
                alt={ altText }
                width={ width }
                height={ height }
                className="object-contain dark:hidden"
                priority
            />
            <Image
                src="/assets/images/logo-dark.webp"
                alt={ altText }
                width={ width }
                height={ height }
                className="absolute inset-0 hidden object-contain dark:block"
                priority
            />
        </AppLink>
    );
}
