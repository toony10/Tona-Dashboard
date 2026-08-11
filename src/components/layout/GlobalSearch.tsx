"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTranslatedNavigation } from "@/hooks/use-translated-navigation";
import { useRouter } from "@/i18n/navigation";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const t = useTranslations("Common");
  const groups = useTranslatedNavigation();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((isOpen) => !isOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const searchableItems = React.useMemo(() => {
    const items: {
      title: string;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
    }[] = [];

    groups.forEach((group) => {
      group.items.forEach((item) => {
        items.push({
          title: item.title,
          href: item.url,
          icon: item.icon,
        });
        item.items?.forEach((child) => {
          items.push({
            title: `${item.title} > ${child.title}`,
            href: child.url,
            icon: item.icon,
          });
        });
      });
    });

    return items;
  }, [groups]);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pe-12 md:w-2/3 lg:w-1/3",
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="me-2 h-4 w-4 shrink-0" />
        <span className="hidden lg:inline-flex">{t("searchPages")}</span>
        <span className="inline-flex lg:hidden">{t("searchShort")}</span>
        <kbd className="pointer-events-none absolute end-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t("commandPalette")}
        description={t("commandDesc")}
      >
        <CommandInput placeholder={t("commandPlaceholder")} />
        <CommandList>
          <CommandEmpty>{t("noResults")}</CommandEmpty>
          <CommandGroup heading={t("pages")}>
            {searchableItems.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.href + item.title}
                  value={item.title}
                  onSelect={() => {
                    runCommand(() => router.push(item.href));
                  }}
                >
                  <Icon className="me-2 h-4 w-4 shrink-0" />
                  {item.title}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
