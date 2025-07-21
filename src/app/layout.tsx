import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { getMessages, getLocale } from "next-intl/server";
import { AppProviders } from "@/providers/app-providers";
import { siteConfig } from "@/config/site";
import { NetworkStatusIndicator } from "@/components/ui/network-status-indicator";
import { Metadata } from "next";
import { Direction } from "@/types";

// Define the Inter font
const inter = Inter({ subsets: ["latin", "latin-ext"] });

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
  // Get the current locale from the request
  const locale = await getLocale();

  // Get messages for this locale
  const messages = await getMessages();

  // Set the correct direction based on locale
  const dir: Direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={inter.className}
      suppressHydrationWarning
    >
      <body>
        <AppProviders messages={messages} locale={locale}>
          {children}
          <NetworkStatusIndicator />
        </AppProviders>
      </body>
    </html>
  );
}
