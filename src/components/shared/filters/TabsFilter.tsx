"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useQueryNavigation } from "@/components/providers/query-navigation-provider"
import { FILTER_URL_UPDATE_DELAY_MS } from "@/config/constants"
import { debounce, parseAsString, useQueryState } from "nuqs"
import { cn } from "@/lib/utils"
const ALL_VALUE = "__all__"

export type TabsFilterOption = {
  label: string
  value: string
}

export interface TabsFilterProps {
  paramKey: string
  options: TabsFilterOption[]
  allOpt?: boolean
  className?: string
}

export function TabsFilter({
  paramKey,
  options,
  allOpt = true,
  className,
}: TabsFilterProps) {
  const t = useTranslations("Common")
  const { startTransition } = useQueryNavigation()
  const [value, setValue] = useQueryState(
    paramKey,
    parseAsString.withDefault("").withOptions({
      limitUrlUpdates: debounce(FILTER_URL_UPDATE_DELAY_MS),
      clearOnDefault: true,
    }),
  )

  const tabOptions = allOpt
    ? [{ label: t("all"), value: ALL_VALUE }, ...options]
    : options

  const activeValue = value || (allOpt ? ALL_VALUE : "")

  const handleSelect = (next: string) => {
    setValue(next === ALL_VALUE ? null : next, {
      limitUrlUpdates: debounce(FILTER_URL_UPDATE_DELAY_MS),
      startTransition,
    })
  }

  return (
    <div
      role="tablist"
      className={ cn(
        "inline-flex rounded-lg border bg-muted/50 p-1",
        className,
      ) }
    >
      { tabOptions.map((option) => {
        const isActive = activeValue === option.value

        return (
          <button
            key={ option.value }
            type="button"
            role="tab"
            aria-selected={ isActive }
            onClick={ () => handleSelect(option.value) }
            className={ cn(
              "relative z-10 rounded-md px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            ) }
          >
            { isActive ? (
              <motion.span
                layoutId={ `tabs-filter-indicator-${paramKey}` }
                className="absolute inset-0 rounded-md bg-background shadow-sm ring-1 ring-border/50"
                transition={ {
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                } }
              />
            ) : null }
            <motion.span
              className="relative z-10"
              animate={ {
                scale: isActive ? 1 : 0.97,
                opacity: isActive ? 1 : 0.75,
              } }
              transition={ { duration: 0.15 } }
            >
              { option.label }
            </motion.span>
          </button>
        )
      }) }
    </div>
  )
}
