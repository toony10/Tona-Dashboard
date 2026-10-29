"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useIsRtl } from "@/hooks/use-translated-navigation";
import { SidebarLogo } from "./sidebar-logo";
import { GlobalSearch } from "./GlobalSearch";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useTranslatedNavigation } from "@/hooks/use-translated-navigation";

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const groups = useTranslatedNavigation();
  const rtl = useIsRtl();

  return (
    <Sidebar collapsible="icon" side={rtl ? "right" : "left"} {...props}>
      <SidebarHeader className="gap-4 px-3 pt-5 transition-[padding] duration-200 ease-linear group-data-[collapsible=icon]:px-2">
        <SidebarLogo />
        <GlobalSearch />
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        {groups.map((group, index) => (
          <NavMain key={index} items={group.items} />
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
