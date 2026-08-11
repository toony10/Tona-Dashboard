"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useIsRtl } from "@/hooks/use-translated-navigation";
import { SidebarLogo } from "./sidebar-logo";
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
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        {groups.map((group, index) => (
          <NavMain key={index} items={group.items} />
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
