import "@/styles/globals.css";
import { getMessages, getLocale } from "next-intl/server";
import { AppProviders } from "@/providers/app-providers";
import { siteConfig } from "@/config/site";
import { NetworkStatusIndicator } from "@/components/ui/network-status-indicator";
import { Metadata } from "next";
import { Direction } from "@/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: `%s | ${siteConfig.name}`,
      default: siteConfig.name,
    },
    description: siteConfig.description,
  };
}

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir: Direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body>
        <AppProviders messages={messages} locale={locale}>
          {children}
          <NetworkStatusIndicator />
        </AppProviders>
      </body>
    </html>
  );
}
