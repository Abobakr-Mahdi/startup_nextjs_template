"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/common/Buttons";
import { siteConfig } from "@/config/site";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const { isLoading, logout } = useAuth();

  // Navigation items with their paths and translations
  const navItems = [
    { href: "/dashboard", label: t("dashboard") },
    { href: "/profile", label: t("profile") },
    { href: "/settings", label: t("settings") },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            {siteConfig.name}
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <LanguageSwitcher />

            <Button isLoading={isLoading} variant="primary" onClick={logout}>
              {t("logout")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t py-6 bg-background">
        <div className="container flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
