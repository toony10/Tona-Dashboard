import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing } from "./routing";

export async function getActionTranslations<Namespace extends string>(
  locale: string,
  namespace: Namespace,
) {
  const resolvedLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  return getTranslations({
    locale: resolvedLocale,
    namespace,
  });
}
