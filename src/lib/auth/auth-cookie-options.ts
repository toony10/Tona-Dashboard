import { getJwtMaxAgeSeconds } from "./get-jwt-max-age";

export function getAuthCookieOptions(token: string, fallbackMaxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: getJwtMaxAgeSeconds(token) ?? fallbackMaxAge,
  };
}
