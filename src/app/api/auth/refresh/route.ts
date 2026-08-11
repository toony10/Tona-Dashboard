import { NextResponse } from "next/server";

import { refreshSession } from "@/lib/auth";

/**
 * Rotates the session cookies via the backend refresh endpoint.
 * Cookie writes happen inside `refreshSession` → `cookies.ts` helpers.
 */
export async function POST() {
  const refreshed = await refreshSession();

  if (!refreshed) {
    return NextResponse.json({ message: "Session expired" }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
