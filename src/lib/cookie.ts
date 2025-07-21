/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith(`${name}=`));

  return cookie?.split("=")[1];
}

/**
 * Set a cookie with options
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    path?: string;
    maxAge?: number;
    expires?: Date;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    httpOnly?: boolean;
    domain?: string;
  } = {}
): void {
  if (typeof document === "undefined") return;

  const {
    path = "/",
    maxAge,
    expires,
    secure = true,
    sameSite = "Strict",
    httpOnly = false,
    domain,
  } = options;

  let cookieString = `${name}=${value}; path=${path}`;

  if (maxAge !== undefined) cookieString += `; max-age=${maxAge}`;
  if (expires) cookieString += `; expires=${expires.toUTCString()}`;
  if (secure) cookieString += "; secure";
  if (sameSite) cookieString += `; samesite=${sameSite}`;
  if (httpOnly) cookieString += "; httponly";
  if (domain) cookieString += `; domain=${domain}`;

  document.cookie = cookieString;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string, path = "/"): void {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Check if a cookie exists
 */
export function hasCookie(name: string): boolean {
  if (typeof document === "undefined") return false;

  const cookies = document.cookie.split("; ");
  return cookies.some((cookie) => cookie.startsWith(`${name}=`));
}
