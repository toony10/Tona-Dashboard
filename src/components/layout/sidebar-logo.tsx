import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/logo/Logo";

export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex justify-center items-center">
        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
          <Logo width={ 160 } height={ 50 } />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
