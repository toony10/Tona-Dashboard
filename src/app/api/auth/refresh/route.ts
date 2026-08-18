import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { REFRESH_TOKEN_COOKIE, clearAuthCookies, refreshTokens, setAuthCookies } from "@/lib/auth";

/**
 * Rotates the session cookies via the backend refresh endpoint.
 */
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "Session expired" }, { status: 401 });
  }

  const tokens = await refreshTokens(refreshToken);

  if (!tokens) {
    clearAuthCookies(cookieStore);
    return NextResponse.json({ message: "Session expired" }, { status: 401 });
  }

  setAuthCookies(cookieStore, tokens.accessToken, tokens.refreshToken);

  return NextResponse.json({ success: true });
}
