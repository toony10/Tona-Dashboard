"use client"

import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useQueryNavigation } from "@/components/providers/query-navigation-provider"
import { cn } from "@/lib/utils"
import { SEARCH_FILTER_URL_UPDATE_DELAY_MS } from "@/config/constants"
import { debounce, parseAsString, useQueryState } from "nuqs"

export interface SearchFilterProps {
  paramKey?: string
  placeholder?: string
  className?: string
}

export function SearchFilter({
  paramKey = "search",
  placeholder,
  className,
}: SearchFilterProps) {
  const t = useTranslations("Filters")
  const { startTransition } = useQueryNavigation()
  const [value, setValue] = useQueryState(
    paramKey,
    parseAsString.withDefault("").withOptions({
      limitUrlUpdates: debounce(SEARCH_FILTER_URL_UPDATE_DELAY_MS),
      clearOnDefault: true,
    }),
  )

  return (
    <InputGroup className={ cn("min-w-40", className) }>
      <InputGroupAddon className="ms-2">
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        placeholder={ placeholder ?? t("searchPlaceholder") }
        value={ value }
        onChange={ (event) => {
          const next = event.target.value
          setValue(next === "" ? null : next, {
            limitUrlUpdates: debounce(SEARCH_FILTER_URL_UPDATE_DELAY_MS),
            startTransition,
          })
        } }
      />
    </InputGroup>
  )
}
