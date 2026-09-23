import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getRequestLocale } from "@/lib/api/get-request-locale";

import { clearAuthCookies } from "./clear-auth-cookies";
import { LOGOUT_PATH } from "./constants";

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

  const locale = await getRequestLocale();
  redirect(`/${locale}${LOGOUT_PATH}`);
}
