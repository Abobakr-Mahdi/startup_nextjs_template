import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { siteConfig } from "./src/config/site";
import { COOKIE_NAMES } from "@/constants";

export default getRequestConfig(async ({ locale: localeFromParams }) => {
  // Start with locale from params or default
  let locale: string = localeFromParams || siteConfig.defaultLocale;

  // In server components, try to get the locale from cookies
  if (typeof window === "undefined") {
    try {
      // This is synchronous in server components
      const cookieValue = (await cookies()).get(COOKIE_NAMES.LOCALE)?.value;

      if (cookieValue) {
        locale = cookieValue;
      }
    } catch (error) {
      console.error("Error accessing cookies:", error);
    }
  }

  // Validate the locale
  if (!siteConfig.locales.includes(locale as "en" | "ar")) {
    locale = siteConfig.defaultLocale;
  }

  try {
    // Load messages for the requested locale
    const messages = (await import(`./messages/${locale}.json`)).default;

    return {
      locale,
      messages,
      timeZone: siteConfig.defaultTimeZone,
      onError: (error) => {
        console.error("i18n error:", error);
      },
    };
  } catch (error) {
    // Fallback to default locale if messages for requested locale can't be loaded
    console.error(`Failed to load messages for locale "${locale}":`, error);
    const fallbackMessages = (
      await import(`./messages/${siteConfig.defaultLocale}.json`)
    ).default;

    return {
      messages: fallbackMessages,
      locale: siteConfig.defaultLocale,
      timeZone: siteConfig.defaultTimeZone,
    };
  }
});
