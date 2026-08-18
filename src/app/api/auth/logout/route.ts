import { NextResponse } from "next/server";

import { apiClient, clearAuthCookiesFromStore } from "@/lib/api";

/**
 * Best-effort backend logout, then always clear local auth cookies.
 */
export async function POST() {
  await apiClient("auth/logout", { method: "POST" });
  await clearAuthCookiesFromStore();

  return NextResponse.json({ success: true });
}
