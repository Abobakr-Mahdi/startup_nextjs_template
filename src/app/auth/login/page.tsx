"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect, Suspense } from "react";
import { LoginCredentials, useAuth } from "@/features/auth";
import { QUERY_STATE_MANAGERS } from "@/constants";
import { appRoutes } from "@/routes";

// Separate component for handling search params
function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState<LoginCredentials>({
    identifier: "m.alhilalee@gmail.com",
    password: "123456",
    login_method: "email",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (authError) {
      setFormError(authError);
    }
  }, [authError]);

  const callbackUrl =
    searchParams?.get(QUERY_STATE_MANAGERS.CALLBACK_URL) || appRoutes.HOME.path;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formError) {
      setFormError("");
      clearError();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    try {
      await login(formData);
      router.replace(
        callbackUrl ? decodeURIComponent(callbackUrl) : appRoutes.HOME.path
      );
    } catch (error) {
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

// Main component with Suspense boundary
export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
