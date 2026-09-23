import "server-only";

import { cookies, headers } from "next/headers";

export type ApiLocale = "ar" | "en";

const DEFAULT_LOCALE: ApiLocale = "en";

function localeFromSegment(segment: string | undefined): ApiLocale | undefined {
  if (!segment) return undefined;
  const lower = segment.toLowerCase();
  if (lower === "ar" || lower.startsWith("ar-")) return "ar";
  if (lower === "en" || lower.startsWith("en-")) return "en";
  return undefined;
}

function localeFromPathname(pathname: string): ApiLocale | undefined {
  return localeFromSegment(pathname.split("/").filter(Boolean)[0]);
}

/**
 * Current app locale for outbound API calls and localized redirects.
 *
 * Avoids `next-intl` `getLocale()` so this works in Server Actions as well as
 * RSC (root params are not available inside actions).
 */
export async function getRequestLocale(): Promise<ApiLocale> {
  const cookieStore = await cookies();
  const headerList = await headers();

  const fromIntlHeader = localeFromSegment(
    headerList.get("x-next-intl-locale") ?? undefined,
  );
  if (fromIntlHeader) return fromIntlHeader;

  const fromCookie = localeFromSegment(cookieStore.get("NEXT_LOCALE")?.value);
  if (fromCookie) return fromCookie;

  const hint =
    headerList.get("referer") ??
    headerList.get("x-url") ??
    headerList.get("next-url") ??
    headerList.get("x-invoke-path") ??
    "";

  try {
    const pathname = hint.startsWith("http") ? new URL(hint).pathname : hint;
    return localeFromPathname(pathname) ?? DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}
