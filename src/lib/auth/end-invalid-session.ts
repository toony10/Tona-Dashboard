import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { clearAuthCookies } from "./clear-auth-cookies";
import { LOGOUT_PATH } from "./constants";

function localeFromPathname(pathname: string): string | undefined {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && /^[a-z]{2}(?:-[A-Z]{2})?$/.test(segment)) return segment;
  return undefined;
}

async function resolveLocale(): Promise<string> {
  const cookieStore = await cookies();
  const headerList = await headers();

  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  if (cookieLocale) return cookieLocale;

  const hint =
    headerList.get("referer") ?? headerList.get("x-url") ?? headerList.get("next-url") ?? "";

  try {
    const pathname = hint.startsWith("http") ? new URL(hint).pathname : hint;
    return localeFromPathname(pathname) ?? "en";
  } catch {
    return "en";
  }
}

/**
 * Drop the session and send the user to login.
 *
 * Cookie deletes work in Server Actions. During RSC render they throw, so we
 * always bounce through `/{locale}/logout` where the proxy clears cookies.
 */
export async function endInvalidSession(): Promise<never> {
  try {
    clearAuthCookies(await cookies());
  } catch {
    // Proxy `/logout` will delete the cookies on the redirect response.
  }

  const locale = await resolveLocale();
  redirect(`/${locale}${LOGOUT_PATH}`);
}
