"use client";

import { User, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { user } from "@/config/navigation";
import { useIsRtl } from "@/hooks/use-translated-navigation";

export function NavUser() {
  const { isMobile } = useSidebar();
  const t = useTranslations("Common");
  const tUser = useTranslations("User");
  const tNav = useTranslations("Nav");
  const rtl = useIsRtl();
  const name = tUser("name");
  const email = tUser("email");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user.avatar} alt={name} />
                <AvatarFallback className="rounded-full bg-primary/10">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span
                  className="truncate text-xs text-muted-foreground"
                  dir="ltr"
                >
                  {email}
                </span>
              </div>
              <ChevronsUpDown className="ms-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : rtl ? "left" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{tNav("settings")}</DropdownMenuItem>
            <DropdownMenuItem>{t("support")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("logout")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
