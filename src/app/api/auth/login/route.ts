import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api";
import { setAuthCookies } from "@/lib/auth";
import type { AuthTokens } from "@/lib/api/types";
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

  const response = await apiClient<AuthTokens, LoginBody>("auth/login", {
    method: "POST",
    body: { email, password },
  });

  const accessToken = response.data?.accessToken;
  const refreshToken = response.data?.refreshToken;

  if (!response.success || !accessToken || !refreshToken) {
    return NextResponse.json(
      { message: response.message || "Invalid credentials" },
      { status: response.statusCode || 401 },
    );
  }

  const cookieStore = await cookies();
  setAuthCookies(cookieStore, accessToken, refreshToken);

  return NextResponse.json({ success: true });
}
