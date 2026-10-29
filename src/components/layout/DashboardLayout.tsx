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
      <SidebarInset className="bg-transparent">
        <Header />
        <main className="mx-auto flex w-full max-w-[85rem] flex-1 flex-col gap-(--page-gap) p-4 pb-10 lg:px-8 lg:pt-7">
          <QueryNavigationProvider>{children}</QueryNavigationProvider>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
