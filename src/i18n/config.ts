import { routing, type AppLocale } from "./routing";

export { getDirection, isRtl, type Direction } from "@/lib/i18n/direction";

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

export function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}
