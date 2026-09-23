"use client";

import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md transition-shadow duration-200 lg:h-[60px] lg:px-6",
        scrolled && "shadow-sm",
      )}
    >
      <SidebarTrigger className="-ms-1 cursor-pointer" />
      <div className="w-full flex-1" />
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>
    </header>
  );
}
