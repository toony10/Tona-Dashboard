import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/api/config";
import { clearAuthCookies, getAccessToken } from "@/lib/auth";

/**
 * Best-effort backend logout, then always clear local auth cookies.
 */
export async function POST() {
  const accessToken = await getAccessToken();

  if (accessToken) {
    try {
      await fetch(`${getApiBaseUrl()}/auth/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });
    } catch {
      // Local session is cleared regardless of backend reachability.
    }
  }

  await clearAuthCookies();

  return NextResponse.json({ success: true });
}
