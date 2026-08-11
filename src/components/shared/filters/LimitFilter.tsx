"use client"

import { useTranslations } from "next-intl"

import { useQueryNavigation } from "@/components/providers/query-navigation-provider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { DEFAULT_LIMIT, FILTER_URL_UPDATE_DELAY_MS } from "@/config/constants"
import { debounce, parseAsInteger, useQueryState } from "nuqs"

const DEFAULT_LIMIT_OPTIONS = [10, 20, 30, 40, 50]

export interface LimitFilterProps {
  paramKey?: string
  options?: number[]
  defaultLimit?: number
  placeholder?: string
  className?: string
}

export function LimitFilter({
  paramKey = "limit",
  options = DEFAULT_LIMIT_OPTIONS,
  defaultLimit = DEFAULT_LIMIT,
  placeholder,
  className,
}: LimitFilterProps) {
  const t = useTranslations("Filters")
  const { startTransition } = useQueryNavigation()
  const [limit, setLimit] = useQueryState(
    paramKey,
    parseAsInteger.withDefault(defaultLimit).withOptions({
      limitUrlUpdates: debounce(FILTER_URL_UPDATE_DELAY_MS),
      clearOnDefault: true,
    }),
  )

  return (
    <Select
      value={ String(limit) }
      onValueChange={ (next) => {
        setLimit(Number(next), {
          limitUrlUpdates: debounce(FILTER_URL_UPDATE_DELAY_MS),
          startTransition,
        })
      } }
    >
      <SelectTrigger className={ cn("w-full min-w-40", className) }>
        <SelectValue placeholder={ placeholder ?? t("limitPlaceholder") } />
      </SelectTrigger>
      <SelectContent>
        { options.map((option) => (
          <SelectItem key={ option } value={ String(option) }>
            { option }
          </SelectItem>
        )) }
      </SelectContent>
    </Select>
  )
}
