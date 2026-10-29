import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LoginForm } from "@/components/forms/auth";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import AnimationWrapper from "@/components/shared/animations/AnimationWrapper";
import { AuthShell } from "@/components/shared/auth";

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

  const t = await getTranslations({ locale, namespace: "Auth.loginForm" });

  return (
    <AuthShell
      illustrationLabel={ t("illustrationAlt") }
      context={ t("panelDescription") }
      headerEnd={
        <>
          <LocaleSwitcher />
          <ThemeSwitcher />
        </>
      }
    >
      <AnimationWrapper className="w-full">
        <LoginForm layout="split" />
      </AnimationWrapper>
    </AuthShell>
  );
}
