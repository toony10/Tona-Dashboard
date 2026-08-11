"use client"

import { useMemo } from "react"
import { ChevronDownIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQueryNavigation } from "@/components/providers/query-navigation-provider"
import { cn } from "@/lib/utils"
import { FILTER_URL_UPDATE_DELAY_MS } from "@/config/constants"
import { debounce, parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import type { SelectFilterOption } from "./SelectFilter"

export interface MultipleSelectFilterProps {
  paramKey: string
  options: SelectFilterOption[]
  placeholder?: string
  className?: string
}

export function MultipleSelectFilter({
  paramKey,
  options,
  placeholder,
  className,
}: MultipleSelectFilterProps) {
  const t = useTranslations("Filters")
  const { startTransition } = useQueryNavigation()
  const [values, setValues] = useQueryState(
    paramKey,
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({
      limitUrlUpdates: debounce(FILTER_URL_UPDATE_DELAY_MS),
      clearOnDefault: true,
    }),
  )

  const valueSet = useMemo(() => new Set(values), [values])

  const labelByValue = useMemo(
    () => Object.fromEntries(options.map((option) => [option.value, option.label])),
    [options],
  )

  const displayLabel = useMemo(() => {
    if (values.length === 0) return null
    if (values.length === 1) return labelByValue[values[0]] ?? values[0]
    return t("nSelected", { count: values.length })
  }, [values, labelByValue, t])

  const toggleValue = (optionValue: string) => {
    const next = valueSet.has(optionValue)
      ? values.filter((value) => value !== optionValue)
      : [...values, optionValue]

    setValues(next.length === 0 ? null : next, {
      limitUrlUpdates: debounce(FILTER_URL_UPDATE_DELAY_MS),
      startTransition,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={ cn(
          "flex h-8 w-full min-w-40 items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pe-2 ps-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          !displayLabel && "text-muted-foreground",
          className,
        ) }
      >
        <span className="line-clamp-1">
          { displayLabel ?? placeholder ?? t("multiSelectPlaceholder") }
        </span>
        <ChevronDownIcon className="size-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
        { options.map((option) => (
          <DropdownMenuCheckboxItem
            key={ option.value }
            checked={ valueSet.has(option.value) }
            onCheckedChange={ () => toggleValue(option.value) }
            onSelect={ (event) => event.preventDefault() }
          >
            { option.label }
          </DropdownMenuCheckboxItem>
        )) }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
