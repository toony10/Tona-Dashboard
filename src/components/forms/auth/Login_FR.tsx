"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

import { loginAction } from "@/actions/auth";
import { useRouter } from "@/i18n/navigation";
import { setAuthUser } from "@/lib/auth/user-storage";
import { cn } from "@/lib/utils";
import { createLoginSchema } from "@/validations/auth";
import {
  Form,
  FormControl,
  FormErrors,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  SubmitButton,
  useCrudForm,
} from "@/lib/forms";
import { Logo } from "@/components/shared/logo/Logo";
import { AppLink } from "@/components/shared/navigation/AppLink";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export function LoginForm() {
  const t = useTranslations("Auth.loginForm");
  const tCrud = useTranslations("Crud");
  const locale = useLocale();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const { form, onSubmit, serverErrors, isSubmitting } = useCrudForm({
    schema: loginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
    action: (values) => loginAction(values, locale),
    resetOnSuccess: false,
    onSuccess: (result) => {
      if (result.data) {
        setAuthUser(result.data);
      }
      router.replace("/");
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={onSubmit} noValidate>
        <div className="flex flex-col items-center gap-2 pb-2">
          <Logo width={200} height={44} />
          <h1 className="text-center text-xl font-semibold text-foreground">
            {t("welcomeTitle")}
          </h1>
        </div>

        <FormErrors errors={serverErrors} title={tCrud("errorsTitle")} />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.email")}</FormLabel>
              <InputGroup className="h-12">
                <InputGroupAddon className="ps-2">
                  <Mail className="size-4" />
                </InputGroupAddon>
                <FormControl>
                  <InputGroupInput
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    placeholder={t("placeholders.email")}
                    {...field}
                  />
                </FormControl>
              </InputGroup>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-2">
                <FormLabel>{t("fields.password")}</FormLabel>
                <AppLink
                  href="/forget-password"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("forgotPassword")}
                </AppLink>
              </div>
              <InputGroup className="h-12">
                <InputGroupAddon className="ps-2">
                  <Lock className="size-4" />
                </InputGroupAddon>
                <FormControl>
                  <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    dir="ltr"
                    autoComplete="current-password"
                    placeholder={t("placeholders.password")}
                    {...field}
                  />
                </FormControl>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={
                      showPassword ? t("hidePassword") : t("showPassword")
                    }
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton
          loading={isSubmitting}
          loadingLabel={t("submitting")}
          size="lg"
          className="h-12 w-full"
        >
          {t("submit")}
          <ArrowRight
            className={cn(
              "rtl:rotate-180 transition-transform group-hover:translate-x-0.5",
            )}
          />
        </SubmitButton>
      </form>
    </Form>
  );
}
