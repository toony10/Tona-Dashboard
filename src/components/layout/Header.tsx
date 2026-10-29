"use client";

import { Bell } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthUser } from "@/hooks/use-auth-user";
import { HeaderBand } from "./HeaderBand";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LocaleSwitcher } from "./LocaleSwitcher";

const headerIconButton =
  "relative size-10 rounded-lg border-transparent bg-transparent text-muted-foreground shadow-none hover:text-foreground aria-expanded:bg-transparent dark:bg-transparent";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/75 pe-4 backdrop-blur-md lg:pe-8">
      <HeaderBand>
        <SidebarTrigger className="-ms-1 size-10 shrink-0 cursor-pointer rounded-lg" />
        <HeaderWelcome />
      </HeaderBand>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <LocaleSwitcher className={headerIconButton} />
        <ThemeSwitcher className={headerIconButton} />
        <NotificationButton />
      </div>
    </header>
  );
}

function HeaderWelcome() {
  const t = useTranslations("Common");
  const format = useFormatter();
  const { authUser, isReady } = useAuthUser();
  const fullName = authUser?.fullName?.trim() ?? "";

  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-normal leading-tight sm:text-base">
        {isReady && fullName
          ? t.rich("welcomeWithName", {
              name: fullName,
              b: (chunks) => <span className="font-bold">{chunks}</span>,
            })
          : t("welcome")}
      </p>
      <p
        className="truncate text-xs text-muted-foreground"
        suppressHydrationWarning
      >
        {format.dateTime(new Date(), {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
}

function NotificationButton() {
  const t = useTranslations("Common");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={t("notifications")}
          className={headerIconButton}
        >
          <Bell className="size-4" />
          <span
            aria-hidden
            className="absolute top-2.5 end-2.5 size-2 rounded-full bg-destructive ring-2 ring-card"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl">
        <DropdownMenuLabel>{t("notifications")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <p className="px-2 py-3 text-sm text-muted-foreground">
          {t("noNotifications")}
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
