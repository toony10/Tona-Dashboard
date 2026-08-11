import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/api/config";
import { isAuthTokens, persistAuthTokens } from "@/lib/auth";
import type { LoginBody } from "@/types/auth";

/**
 * Proxies credentials to the backend login endpoint and stores the returned
 * tokens as httpOnly cookies. Tokens never leave the server response as JSON.
 */
export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "Unable to reach authentication service" }, { status: 502 });
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      typeof (payload as { message?: unknown }).message === "string"
        ? (payload as { message: string }).message
        : "Invalid credentials";

    return NextResponse.json({ message }, { status: response.status });
  }

  if (!isAuthTokens(payload)) {
    return NextResponse.json({ message: "Unexpected authentication response" }, { status: 502 });
  }

  await persistAuthTokens(payload);

  return NextResponse.json({ success: true });
}
