"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

import {
  navigation,
  type NavGroup,
  type NavItem,
  type NavSubItem,
  type NavTitleKey,
} from "@/config/navigation";

export type TranslatedNavSubItem = NavSubItem & { title: string };
export type TranslatedNavItem = Omit<NavItem, "items"> & {
  title: string;
  items?: TranslatedNavSubItem[];
};
export type TranslatedNavGroup = Omit<NavGroup, "items"> & {
  items: TranslatedNavItem[];
};

/**
 * Resolves navigation config `titleKey`s into localized titles.
 * Use in client shell components (sidebar, global search, etc.).
 */
export function useTranslatedNavigation(): TranslatedNavGroup[] {
  const t = useTranslations("Nav");

  return useMemo(
    () =>
      navigation.map((group) => ({
        ...group,
        items: group.items.map((item) => ({
          ...item,
          title: t(item.titleKey as NavTitleKey),
          items: item.items?.map((sub) => ({
            ...sub,
            title: t(sub.titleKey as NavTitleKey),
          })),
        })),
      })),
    [t],
  );
}

/** Current document direction for the active locale. */
export function useDirection(): "ltr" | "rtl" {
  const locale = useLocale();
  return locale === "ar" ? "rtl" : "ltr";
}

export function useIsRtl(): boolean {
  return useDirection() === "rtl";
}
