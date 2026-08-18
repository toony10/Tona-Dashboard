import "server-only";

import { cookies } from "next/headers";

import { clearAuthCookies } from "./clear-auth-cookies";

export async function clearAuthCookiesFromStore() {
  const cookieStore = await cookies();
  clearAuthCookies(cookieStore);
}
