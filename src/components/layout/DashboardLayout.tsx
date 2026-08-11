"use client";

import { AppSidebar } from "./app-sidebar";
import { Header } from "./Header";
import { QueryNavigationProvider } from "@/components/providers/query-navigation-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function DashboardLayout({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <QueryNavigationProvider>{children}</QueryNavigationProvider>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
