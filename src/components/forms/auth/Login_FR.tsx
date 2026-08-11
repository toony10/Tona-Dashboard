"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Logo } from "@/components/shared/logo/Logo";
import { AppLink } from "@/components/shared/navigation/AppLink";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const t = useTranslations("Auth");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="space-y-6"
      onSubmit={ (event) => {
        event.preventDefault();
      } }
    >
      <div className="flex justify-center items-center pb-2">
        <Logo width={ 160 } height={ 50 } />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          { t("email") }
        </label>
        <InputGroup className="h-10">
          <InputGroupAddon>
            <Mail className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder={ t("emailPlaceholder") }
            required
          />
        </InputGroup>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            { t("password") }
          </label>
          <AppLink
            href="#"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            { t("forgotPassword") }
          </AppLink>
        </div>
        <InputGroup className="h-10">
          <InputGroupAddon>
            <Lock className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="password"
            name="password"
            type={ showPassword ? "text" : "password" }
            dir="ltr"
            autoComplete="current-password"
            placeholder={ t("passwordPlaceholder") }
            required
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={
                showPassword ? t("hidePassword") : t("showPassword")
              }
              onClick={ () => setShowPassword((value) => !value) }
            >
              { showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              ) }
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <Button type="submit" size="lg" className="cursor-pointer group h-10 w-full">
        { t("submit") }
        <ArrowRight
          className={ cn(
            "rtl:rotate-180 transition-transform group-hover:translate-x-0.5",
          ) }
        />
      </Button>
    </form>
  );
}
