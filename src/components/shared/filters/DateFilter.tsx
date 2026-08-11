"use client"

import { format, isValid, parseISO } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import * as React from "react"
import { debounce, parseAsString, useQueryState } from "nuqs"
import { useQueryNavigation } from "@/components/providers/query-navigation-provider"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FILTER_URL_UPDATE_DELAY_MS } from "@/config/constants"
import { cn } from "@/lib/utils"

function toISOParam(date: Date): string {
  return date.toISOString()
}

function fromISOParam(value: string): Date | undefined {
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed : undefined
}

export interface DateFilterProps {
  paramKey: string
  placeholder?: string
  className?: string
}

export function DateFilter({
  paramKey,
  placeholder,
  className,
}: DateFilterProps) {
  const t = useTranslations("Filters")
  const locale = useLocale()
  const dateLocale = locale === "ar" ? ar : enUS
  const { startTransition } = useQueryNavigation()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = useQueryState(
    paramKey,
    parseAsString.withDefault("").withOptions({
      limitUrlUpdates: debounce(FILTER_URL_UPDATE_DELAY_MS),
      clearOnDefault: true,
    }),
  )

  const selectedDate = value ? fromISOParam(value) : undefined

  return (
    <Popover open={ open } onOpenChange={ setOpen }>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={ cn(
            "w-full min-w-40 justify-start text-start font-normal",
            !selectedDate && "text-muted-foreground",
            className,
          ) }
        >
          <CalendarIcon />
          { selectedDate
            ? format(selectedDate, "PPP", { locale: dateLocale })
            : placeholder ?? t("datePlaceholder") }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={ dateLocale }
          selected={ selectedDate }
          onSelect={ (date) => {
            setValue(date ? toISOParam(date) : null, {
              limitUrlUpdates: debounce(FILTER_URL_UPDATE_DELAY_MS),
              startTransition,
            })
            setOpen(false)
          } }
        />
      </PopoverContent>
    </Popover>
  )
}
