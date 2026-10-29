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
import { useAuthUser } from "@/hooks/use-auth-user";
import { useIsRtl } from "@/hooks/use-translated-navigation";
import { useRouter } from "@/i18n/navigation";
import { getImg } from "@/lib/http";

export function NavUser() {
  const { isMobile } = useSidebar();
  const t = useTranslations("Common");
  const tUser = useTranslations("User");
  const tNav = useTranslations("Nav");
  const rtl = useIsRtl();
  const router = useRouter();
  const { authUser } = useAuthUser();

  const name = authUser?.fullName?.trim() || tUser("name");
  const email = authUser?.email || tUser("email");
  const avatarSrc = authUser?.avatar ? getImg(authUser.avatar) : user.avatar;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={name}
              className="border border-sidebar-border bg-surface-low text-foreground group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent data-[state=open]:bg-muted"
            >
              <Avatar className="size-8 overflow-hidden rounded-full after:rounded-full">
                <AvatarImage className="rounded-full" src={avatarSrc} alt="" />
                <AvatarFallback className="rounded-full bg-secondary-container font-semibold text-on-secondary-container">
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">{name}</span>
                <span
                  className="truncate text-xs text-muted-foreground"
                  dir="ltr"
                >
                  {email}
                </span>
              </div>
              <ChevronsUpDown className="ms-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl"
            side={isMobile ? "top" : rtl ? "left" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="font-normal">
              <span className="block truncate text-sm font-semibold">
                {name}
              </span>
              <span
                className="block truncate text-xs text-muted-foreground"
                dir="ltr"
              >
                {email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              {tNav("settings")}
            </DropdownMenuItem>
            <DropdownMenuItem>{t("support")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">{t("logout")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
