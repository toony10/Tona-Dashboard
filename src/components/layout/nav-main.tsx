"use client";

import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuIndicator,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { AppLink } from "@/components/shared/navigation/AppLink";
import { usePathname } from "@/i18n/navigation";
import type { TranslatedNavItem } from "@/hooks/use-translated-navigation";

type NavMainProps = {
  items: TranslatedNavItem[];
};

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  const checkIsActive = (item: TranslatedNavItem) => {
    if (pathname === item.url) return true;
    if (item.url !== "/" && pathname.startsWith(item.url + "/")) return true;
    if (
      item.items?.some(
        (subItem) =>
          pathname === subItem.url ||
          pathname.startsWith(subItem.url + "/"),
      )
    ) {
      return true;
    }
    return false;
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuIndicator />
          {items.map((item) => {
            const isActive = checkIsActive(item);
            const hasSubItems = item.items && item.items.length > 0;

            if (hasSubItems) {
              return (
                <Collapsible
                  key={item.id}
                  asChild
                  defaultOpen={isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronDown className="sidebar-label ms-auto h-4 w-4 shrink-0 group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isSubActive =
                            pathname === subItem.url ||
                            (subItem.url !== "/" &&
                              pathname.startsWith(subItem.url + "/"));

                          return (
                            <SidebarMenuSubItem key={subItem.titleKey}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isSubActive}
                              >
                                <AppLink href={subItem.url}>
                                  <span className="text-sm">{subItem.title}</span>
                                </AppLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                >
                  <AppLink href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </AppLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
