"use client";

import { useLocale } from "next-intl";
import { siteConfig } from "@/config/site";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { COOKIE_NAMES, CSS_CLASSES } from "@/constants";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("common");

  // Function to switch the language
  const switchLanguage = (newLocale: string) => {
    // Set cookie for the locale
    // document.cookie = `${COOKIE_NAMES.LOCALE}=${newLocale};path=${COOKIE_SETTINGS.PATH};max-age=${COOKIE_SETTINGS.LOCALE_MAX_AGE}`;
    document.cookie = `${COOKIE_NAMES.LOCALE}=${newLocale}`;

    // Force a hard refresh to apply the new locale
    window.location.reload();
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {siteConfig.locales.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => switchLanguage(lang)}
          className={cn(
            "px-3 py-1 rounded text-sm font-medium transition-colors",
            locale === lang
              ? CSS_CLASSES.ACTIVE_BUTTON
              : CSS_CLASSES.INACTIVE_BUTTON
          )}
          disabled={locale === lang}
        >
          {lang === "en" ? t("english") : t("arabic")}
        </button>
      ))}
    </div>
  );
}
