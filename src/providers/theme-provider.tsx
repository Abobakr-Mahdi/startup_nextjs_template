import { siteConfig } from "@/config/site";
import { COOKIE_NAMES } from "@/constants";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type PropsWithChildren } from "react";

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme={siteConfig.defaultTheme}
      enableSystem
      disableTransitionOnChange
      storageKey={COOKIE_NAMES.THEME}
    >
      {children}
    </NextThemeProvider>
  );
}
