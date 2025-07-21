import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "./config/site";
import { COOKIE_NAMES, QUERY_STATE_MANAGERS } from "./constants";
import { routeUtils } from "./routes";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Create response
  const response = NextResponse.next();

  // Handle locale
  const locale =
    request.cookies.get(COOKIE_NAMES.LOCALE)?.value || siteConfig.defaultLocale;
  if (!request.cookies.has(COOKIE_NAMES.LOCALE)) {
    response.cookies.set(COOKIE_NAMES.LOCALE, locale);
  }

  // Check authentication
  const authToken = request.cookies.get(COOKIE_NAMES.AUTH_TOKEN)?.value;
  const userData = request.cookies.get(COOKIE_NAMES.USER_DATA)?.value;
  const isAuthenticated = !!authToken && !!userData;

  // Handle auth redirects
  if (!isAuthenticated && routeUtils.requiresAuth(path)) {
    const url = new URL(routeUtils.getLoginUrl(), request.url);
    url.searchParams.set(
      QUERY_STATE_MANAGERS.CALLBACK_URL,
      encodeURIComponent(path)
    );
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && routeUtils.isAuthPath(path)) {
    return NextResponse.redirect(new URL(routeUtils.getHomeUrl(), request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
