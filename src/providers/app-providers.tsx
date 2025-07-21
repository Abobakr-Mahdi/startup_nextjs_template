"use client";

import { type PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { ReduxProvider } from "./redux-provider";
import { AuthProvider } from "./auth-provider";
import { NextIntlClientProvider } from "next-intl";
import { siteConfig } from "@/config/site";

interface AppProvidersProps extends PropsWithChildren {
  messages: Record<string, Record<string, string>>;
  locale: string;
}

export function AppProviders({
  children,
  messages,
  locale,
}: AppProvidersProps) {
  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
      timeZone={siteConfig.defaultTimeZone}
    >
      <ReduxProvider>
        <AuthProvider>
          <ThemeProvider>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </ReduxProvider>
    </NextIntlClientProvider>
  );
}
