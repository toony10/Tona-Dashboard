import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LoginForm } from "@/components/forms/auth";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import AnimationWrapper from "@/components/shared/animations/AnimationWrapper";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth.loginForm" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative flex min-h-svh items-center justify-center px-6 py-12">
      <div className="absolute top-6 end-6 flex items-center gap-2">
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>

      <AnimationWrapper className="w-full max-w-sm rounded-xl border p-8 shadow-lg ring-1 ring-foreground/5 backdrop-blur-md bg-card/20">
        <LoginForm />
      </AnimationWrapper>
    </div>
  );
}
