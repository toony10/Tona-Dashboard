"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { RotateCcw } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQueryNavigation } from "@/components/providers/query-navigation-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { parseAsString, useQueryStates } from "nuqs"

export interface ResetFiltersProps {
  keys: string[]
  label?: string
  className?: string
}

export function ResetFilters({
  keys,
  label,
  className,
}: ResetFiltersProps) {
  const t = useTranslations("Filters")
  const { startTransition } = useQueryNavigation()
  const searchParams = useSearchParams()
  const keysKey = keys.join("\0")
  const keyMap = useMemo(
    () => Object.fromEntries(keys.map((key) => [key, parseAsString])),
    [keysKey],
  )
  const [, setStates] = useQueryStates(keyMap)

  const hasActiveFilters = keys.some((key) => searchParams.has(key))

  const reset = () => {
    setStates(Object.fromEntries(keys.map((key) => [key, null])), {
      startTransition,
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={ cn(className) }
      disabled={ !hasActiveFilters }
      onClick={ reset }
    >
      <RotateCcw />
      { label ?? t("resetLabel") }
    </Button>
  )
}
