import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/logo/Logo";
import { LogoMin } from "@/components/shared/logo/LogoMin";

export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center">
        <SidebarMenuButton
          size="lg"
          asChild
          className="h-auto justify-start overflow-hidden px-2 py-1.5 hover:bg-transparent group-data-[collapsible=icon]:hidden"
        >
          <Logo width={ 132 } height={ 40 } />
        </SidebarMenuButton>
        <SidebarMenuButton
          size="lg"
          asChild
          className="hidden size-8! justify-center p-1 hover:bg-transparent group-data-[collapsible=icon]:inline-flex"
        >
          <LogoMin size={ 28 } />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
