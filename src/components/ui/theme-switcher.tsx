"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTheme as setReduxTheme } from "@/store/slices/ui-slice";
import { cn } from "@/lib/utils";
import { Theme } from "@/types";
import { CSS_CLASSES } from "@/constants";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  // Wait for component to be mounted to access theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep Redux in sync with theme changes
  useEffect(() => {
    if (mounted && theme) {
      dispatch(setReduxTheme(theme as Theme));
    }
  }, [theme, mounted, dispatch]);

  if (!mounted) {
    return null; // Avoid rendering before mounted to prevent hydration mismatch
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "rounded-md p-2 transition-colors",
          theme === "light"
            ? CSS_CLASSES.ACTIVE_BUTTON
            : CSS_CLASSES.INACTIVE_BUTTON_PRIMARY_HOVER
        )}
        aria-label="Light mode"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "rounded-md p-2 transition-colors",
          theme === "dark"
            ? CSS_CLASSES.ACTIVE_BUTTON
            : CSS_CLASSES.INACTIVE_BUTTON_PRIMARY_HOVER
        )}
        aria-label="Dark mode"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        className={cn(
          "rounded-md p-2 transition-colors",
          theme === "system"
            ? CSS_CLASSES.ACTIVE_BUTTON
            : CSS_CLASSES.INACTIVE_BUTTON_PRIMARY_HOVER
        )}
        aria-label="System mode"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      </button>
    </div>
  );
}
