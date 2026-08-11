import { routing, type AppLocale } from "./routing";

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

export type Direction = "ltr" | "rtl";

export function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

export function getDirection(locale: string): Direction {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isRtl(locale: string): boolean {
  return getDirection(locale) === "rtl";
}
