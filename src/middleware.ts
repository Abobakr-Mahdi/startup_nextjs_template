import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "./config/site";
import { COOKIE_NAMES, QUERY_STATE_MANAGERS } from "./constants";
import { routeUtils } from "./routes";

/**
 * Simple middleware that:
 * 1. Sets a default locale cookie if one doesn't exist
 * 2. Handles auth protection for routes
 */
export function middleware(request: NextRequest) {
  // Get the path from the URL
  const path = request.nextUrl.pathname;

  // Get the locale from the cookie or use default
  const locale =
    request.cookies.get(COOKIE_NAMES.LOCALE)?.value || siteConfig.defaultLocale;

  // Create a response
  const response = NextResponse.next();

  // Set the locale cookie if it doesn't exist
  if (!request.cookies.has(COOKIE_NAMES.LOCALE)) {
    response.cookies.set(COOKIE_NAMES.LOCALE, locale);
  }

  // Check if a user is authenticated by looking for the auth token
  const authToken = request.cookies.get(COOKIE_NAMES.AUTH_TOKEN)?.value;
  const userData = request.cookies.get(COOKIE_NAMES.USER_DATA)?.value;
  const isAuthenticated = !!authToken && !!userData;

  // Handle redirects for auth protected routes
  if (!isAuthenticated && routeUtils.requiresAuth(path)) {
    // Redirect to login if accessing protected route without auth
    const url = new URL(routeUtils.getLoginUrl(), request.url);
    url.searchParams.set(
      QUERY_STATE_MANAGERS.CALLBACK_URL,
      encodeURIComponent(path)
    );
    return NextResponse.redirect(url);
  }

  // Redirect already authenticated users away from auth pages
  else if (isAuthenticated && routeUtils.isAuthPath(path)) {
    // Redirect to home if accessing auth page while already logged in
    return NextResponse.redirect(new URL(routeUtils.getHomeUrl(), request.url));
  }

  // Return the response with the locale cookie set
  else return response;
}

// Configure the matcher to only run the middleware on specific paths
export const config = {
  matcher: [
    // Match all paths except for static files, api routes, etc.
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
