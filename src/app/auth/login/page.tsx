"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { LoginCredentials, useAuth } from "@/features/auth";
import { QUERY_STATE_MANAGERS } from "@/constants";
import { appRoutes } from "@/routes";

export default function Login() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use the consolidated auth hook
  const { login, isLoading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState<LoginCredentials>({
    identifier: "m.alhilalee@gmail.com",
    password: "123456",
    login_method: "email",
  });
  const [formError, setFormError] = useState("");

  // Clear form error when auth error changes
  useEffect(() => {
    if (authError) {
      setFormError(authError);
    }
  }, [authError]);

  // Get callbackUrl from URL query params
  const callbackUrl =
    searchParams?.get(QUERY_STATE_MANAGERS.CALLBACK_URL) || appRoutes.HOME.path;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors when user starts typing
    if (formError) {
      setFormError("");
      clearError();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    try {
      // Login with our consolidated auth hook
      await login(formData);

      // Use replace instead of push to prevent back button issues
      // and redirect to callbackUrl if provided
      router.replace(
        callbackUrl ? decodeURIComponent(callbackUrl) : appRoutes.HOME.path
      );
    } catch (error) {
      // Error is handled by the useAuth hook
      // We just need to display it
      console.error("Login submission error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t("login")}</h1>
        <p className="text-muted-foreground">{t("enterCredentials")}</p>
      </div>

      {formError && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md">
          {formError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none">
            {t("email")}
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            value={formData.identifier}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md border-input bg-background text-foreground"
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              {t("password")}
            </label>
            <Link
              href={appRoutes.FORGOT_PASSWORD.path}
              className="text-sm text-primary hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md border-input bg-background text-foreground"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
        >
          {isLoading ? t("signingIn") : t("login")}
        </button>
      </form>

      <div className="text-sm text-center text-muted-foreground">
        {t("noAccount")}{" "}
        <Link
          href={appRoutes.REGISTER.path}
          className="text-primary hover:underline"
        >
          {t("signUp")}
        </Link>
      </div>
    </div>
  );
}
