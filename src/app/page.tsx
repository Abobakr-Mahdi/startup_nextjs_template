"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { appRoutes } from "@/routes";

export default function Home() {
  const t = useTranslations("common");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 lg:p-24">
      <div className="z-10 max-w-5xl w-full font-mono flex flex-col items-center justify-between gap-6">
        <h1 className="text-3xl font-bold text-center">{t("welcome")}</h1>
        <p className="mb-8 text-center max-w-prose">{t("description")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mx-auto">
          <div className="border border-border rounded-xl p-4">
            <h2 className="text-lg font-medium">{t("theme")}</h2>
            <div className="mt-2">
              <ThemeSwitcher />
            </div>
          </div>

          <div className="border border-border rounded-xl p-4">
            <h2 className="text-lg font-medium">{t("locale")}</h2>
            <div className="mt-2 flex gap-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="border border-border rounded-xl p-4 w-full max-w-md">
          <h2 className="text-lg font-medium">{t("getting_started")}</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>
              <Link
                href={appRoutes.LOGIN.path}
                className="text-primary hover:underline"
              >
                {t("login_page")}
              </Link>
            </li>
            <li>
              <Link
                href={appRoutes.DASHBOARD.path}
                className="text-primary hover:underline"
              >
                {t("dashboard")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
