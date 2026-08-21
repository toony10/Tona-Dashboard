import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { isAppLocale } from "@/i18n/config";
import { routing } from "@/i18n/routing";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  clearAuthCookies,
  isLogoutPath,
  isValidAccessToken,
  refreshTokens,
  setAuthCookies,
  withAccessTokenHeader,
  withoutClientAccessTokenHeader,
} from "@/lib/auth";

const intlMiddleware = createMiddleware(routing);

const AUTH_ROUTES = ["/login", "/forget-password", "/reset-password"] as const;

function getLocale(pathname: string) {
  const maybeLocale = pathname.split("/")[1];
  if (maybeLocale && isAppLocale(maybeLocale)) return maybeLocale;
  return routing.defaultLocale;
}

function stripLocale(pathname: string) {
  const locale = getLocale(pathname);
  const prefix = `/${locale}`;

  if (pathname === prefix) return "/";
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  return pathname;
}

function isAuthRoute(pathname: string) {
  const path = stripLocale(pathname);
  return AUTH_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));
}

function isProtectedRoute(pathname: string) {
  return !isAuthRoute(pathname);
}

function localizedPath(request: NextRequest, path: string) {
  const url = request.nextUrl.clone();
  url.pathname = `/${getLocale(request.nextUrl.pathname)}${path === "/" ? "" : path}`;
  return url;
}

function continueRequest(request: NextRequest, accessToken?: string) {
  if (!accessToken) {
    return intlMiddleware(request);
  }

  return intlMiddleware(withAccessTokenHeader(request, accessToken));
}

export default async function proxy(request: NextRequest) {
  request = withoutClientAccessTokenHeader(request);

  const { pathname } = request.nextUrl;

  if (isLogoutPath(stripLocale(pathname))) {
    const response = NextResponse.redirect(localizedPath(request, "/login"));
    clearAuthCookies(response.cookies);
    return response;
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const isAuthenticated = isValidAccessToken(accessToken);

  if (isAuthenticated) {
    if (isAuthRoute(pathname)) {
      return NextResponse.redirect(localizedPath(request, "/"));
    }

    return intlMiddleware(request);
  }

  if (refreshToken) {
    const tokens = await refreshTokens(refreshToken);

    if (tokens) {
      const response = isAuthRoute(pathname)
        ? NextResponse.redirect(localizedPath(request, "/"))
        : continueRequest(request, tokens.accessToken);

      setAuthCookies(response.cookies, tokens.accessToken, tokens.refreshToken);
      return response;
    }

    const response = isProtectedRoute(pathname)
      ? NextResponse.redirect(localizedPath(request, "/login"))
      : intlMiddleware(request);

    clearAuthCookies(response.cookies);
    return response;
  }

  // TODO: uncomment when backend auth is ready
  // if (isProtectedRoute(pathname)) {
  //   return NextResponse.redirect(localizedPath(request, "/login"));
  // }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
