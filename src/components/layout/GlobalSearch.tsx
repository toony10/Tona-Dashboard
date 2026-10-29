"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useIsRtl,
  useTranslatedNavigation,
} from "@/hooks/use-translated-navigation";
import { useRouter } from "@/i18n/navigation";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const t = useTranslations("Common");
  const groups = useTranslatedNavigation();
  const rtl = useIsRtl();
  const { state, isMobile, setOpenMobile } = useSidebar();

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

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      setOpenMobile(false);
      command();
    },
    [setOpenMobile],
  );

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
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={t("searchGlobal")}
            onClick={() => setOpen(true)}
            className="flex h-(--control-h) w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-card px-3 text-start text-sm text-muted-foreground outline-none transition-colors hover:border-foreground/35 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/35 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            <Search className="size-4 shrink-0" />
            <span className="truncate group-data-[collapsible=icon]:hidden">
              {t("searchGlobal")}
            </span>
            <kbd
              dir="ltr"
              className="pointer-events-none ms-auto hidden h-5 shrink-0 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex group-data-[collapsible=icon]:hidden"
            >
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side={rtl ? "left" : "right"}
          align="center"
          hidden={state !== "collapsed" || isMobile}
        >
          {t("searchGlobal")}
        </TooltipContent>
      </Tooltip>
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
