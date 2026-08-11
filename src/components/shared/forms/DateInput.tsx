"use client"

import { format, isValid, setHours, setMinutes, setSeconds, startOfDay } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import type { Locale as DateFnsLocale } from "date-fns"
import { CalendarIcon, ClockIcon, XIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/* ─────────────────────────── Types ─────────────────────────── */

export interface DateInputProps {
  /** Field name for the hidden datetime <input> */
  name?: string
  /** Called whenever the selected datetime changes */
  onChange?: (date: Date | undefined) => void
  /** Controlled value */
  value?: Date
  /** Initial value for uncontrolled usage */
  defaultValue?: Date
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  id?: string
  /** Earliest selectable date */
  minDate?: Date
  /** Latest selectable date */
  maxDate?: Date
  /** Include a time picker below the calendar (default: true) */
  withTime?: boolean
  /** Use 12-hour clock with AM/PM (default: true) */
  use12Hour?: boolean
  /** Show seconds in the time picker (default: false) */
  showSeconds?: boolean
  /** Allow clearing the selection (default: true) */
  clearable?: boolean
  /** Close the popover after picking a date when withTime is false */
  closeOnSelect?: boolean
  "aria-label"?: string
}

type Meridiem = "AM" | "PM"

/* ───────────────────────── Helpers ─────────────────────────── */

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function to24Hour(hour12: number, meridiem: Meridiem) {
  if (meridiem === "AM") return hour12 === 12 ? 0 : hour12
  return hour12 === 12 ? 12 : hour12 + 12
}

function to12Hour(hour24: number): { hour: number; meridiem: Meridiem } {
  const meridiem: Meridiem = hour24 >= 12 ? "PM" : "AM"
  const hour = hour24 % 12 || 12
  return { hour, meridiem }
}

function applyTime(
  date: Date,
  hours: number,
  minutes: number,
  seconds: number,
) {
  return setSeconds(setMinutes(setHours(date, hours), minutes), seconds)
}

function formatDisplay(
  date: Date,
  withTime: boolean,
  use12Hour: boolean,
  showSeconds: boolean,
  dateLocale: DateFnsLocale,
) {
  const options = { locale: dateLocale }
  if (!withTime) return format(date, "PPP", options)
  if (use12Hour) {
    return format(date, showSeconds ? "PPP p:ss" : "PPP p", options)
  }
  return format(date, showSeconds ? "PPP HH:mm:ss" : "PPP HH:mm", options)
}

function isWithinRange(date: Date, minDate?: Date, maxDate?: Date) {
  if (minDate && date < startOfDay(minDate)) return false
  if (maxDate && date > startOfDay(maxDate)) return false
  return true
}

/* ─────────────────────── TimeField ─────────────────────────── */

function TimeField({
  label,
  value,
  onChange,
  min,
  max,
  disabled,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{ label }</span>
      <Input
        type="number"
        inputMode="numeric"
        min={ min }
        max={ max }
        value={ String(value).padStart(2, "0") }
        disabled={ disabled }
        className="h-8 px-2 text-center tabular-nums"
        onChange={ (event) => {
          const parsed = Number.parseInt(event.target.value, 10)
          if (Number.isNaN(parsed)) return
          onChange(clamp(parsed, min, max))
        } }
        onBlur={ (event) => {
          const parsed = Number.parseInt(event.target.value, 10)
          onChange(clamp(Number.isNaN(parsed) ? min : parsed, min, max))
        } }
      />
    </div>
  )
}

/* ─────────────────────── DateInput ─────────────────────────── */

export function DateInput({
  name,
  onChange,
  value: valueProp,
  defaultValue,
  placeholder,
  disabled = false,
  required = false,
  className,
  id,
  minDate,
  maxDate,
  withTime = true,
  use12Hour = true,
  showSeconds = false,
  clearable = true,
  closeOnSelect = true,
  "aria-label": ariaLabel,
}: DateInputProps) {
  const t = useTranslations("Forms.dateInput")
  const locale = useLocale()
  const dateLocale = locale === "ar" ? ar : enUS
  const resolvedPlaceholder = placeholder ?? t("placeholder")
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = React.useState<Date | undefined>(
    defaultValue,
  )
  const selectedDate = isControlled ? valueProp : internalValue

  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date>(() => selectedDate ?? new Date())

  const initialTime = React.useMemo(() => {
    const base = selectedDate ?? new Date()
    const hour24 = base.getHours()
    const { hour, meridiem } = to12Hour(hour24)
    return {
      hours: use12Hour ? hour : hour24,
      minutes: base.getMinutes(),
      seconds: base.getSeconds(),
      meridiem,
    }
  }, [selectedDate, use12Hour])

  const [hours, setHoursState] = React.useState(initialTime.hours)
  const [minutes, setMinutesState] = React.useState(initialTime.minutes)
  const [seconds, setSecondsState] = React.useState(initialTime.seconds)
  const [meridiem, setMeridiem] = React.useState<Meridiem>(initialTime.meridiem)

  React.useEffect(() => {
    if (!selectedDate) return
    const hour24 = selectedDate.getHours()
    const parsed = to12Hour(hour24)
    setHoursState(use12Hour ? parsed.hour : hour24)
    setMinutesState(selectedDate.getMinutes())
    setSecondsState(selectedDate.getSeconds())
    setMeridiem(parsed.meridiem)
    setMonth(selectedDate)
  }, [selectedDate, use12Hour])

  const commitValue = React.useCallback(
    (next: Date | undefined) => {
      if (!isControlled) setInternalValue(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  const buildDateTime = React.useCallback(
    (datePart: Date) => {
      const hour24 = use12Hour ? to24Hour(hours, meridiem) : hours
      return applyTime(datePart, hour24, minutes, showSeconds ? seconds : 0)
    },
    [hours, minutes, seconds, meridiem, use12Hour, showSeconds],
  )

  const updateTime = React.useCallback(
    (patch: Partial<{ hours: number; minutes: number; seconds: number; meridiem: Meridiem }>) => {
      const nextHours = patch.hours ?? hours
      const nextMinutes = patch.minutes ?? minutes
      const nextSeconds = patch.seconds ?? seconds
      const nextMeridiem = patch.meridiem ?? meridiem

      if (patch.hours !== undefined) setHoursState(nextHours)
      if (patch.minutes !== undefined) setMinutesState(nextMinutes)
      if (patch.seconds !== undefined) setSecondsState(nextSeconds)
      if (patch.meridiem !== undefined) setMeridiem(nextMeridiem)

      if (!selectedDate) return

      const hour24 = use12Hour
        ? to24Hour(nextHours, nextMeridiem)
        : nextHours
      const next = applyTime(
        selectedDate,
        hour24,
        nextMinutes,
        showSeconds ? nextSeconds : 0,
      )
      commitValue(next)
    },
    [hours, minutes, seconds, meridiem, selectedDate, use12Hour, showSeconds, commitValue],
  )

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      commitValue(undefined)
      return
    }

    const next = withTime ? buildDateTime(date) : startOfDay(date)

    if (!isWithinRange(next, minDate, maxDate)) return

    commitValue(next)
    setMonth(next)

    if (!withTime && closeOnSelect) setOpen(false)
  }

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation()
    commitValue(undefined)
  }

  const handleSetNow = () => {
    const now = new Date()
    if (!isWithinRange(now, minDate, maxDate)) return
    commitValue(now)
    setMonth(now)
  }

  const hiddenValue = selectedDate && isValid(selectedDate)
    ? selectedDate.toISOString()
    : ""

  const displayLabel = selectedDate
    ? formatDisplay(selectedDate, withTime, use12Hour, showSeconds, dateLocale)
    : resolvedPlaceholder

  return (
    <div className={ cn("relative w-full", className) }>
      <Popover open={ open } onOpenChange={ setOpen }>
        <PopoverTrigger asChild>
          <Button
            id={ id }
            type="button"
            variant="outline"
            disabled={ disabled }
            aria-label={ ariaLabel ?? resolvedPlaceholder }
            aria-required={ required }
            className={ cn(
              "w-full justify-start text-start font-normal",
              !selectedDate && "text-muted-foreground",
            ) }
          >
            <CalendarIcon className="size-4 shrink-0" />
            <span className="truncate">{ displayLabel }</span>
            { clearable && selectedDate && !disabled ? (
              <span
                role="button"
                tabIndex={ 0 }
                aria-label={ t("clearDate") }
                className="ms-auto inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={ handleClear }
                onKeyDown={ (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    commitValue(undefined)
                  }
                } }
              >
                <XIcon className="size-3.5" />
              </span>
            ) : null }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={ dateLocale }
            month={ month }
            onMonthChange={ setMonth }
            selected={ selectedDate }
            onSelect={ handleDateSelect }
            disabled={ (date) => !isWithinRange(date, minDate, maxDate) }
            captionLayout="dropdown"
            startMonth={ minDate }
            endMonth={ maxDate }
          />

          { withTime ? (
            <div className="space-y-3 border-t p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ClockIcon className="size-4 text-muted-foreground" />
                { t("time") }
              </div>
              <div className="flex items-end gap-2">
                <TimeField
                  label={ use12Hour ? t("hour") : t("hours") }
                  value={ hours }
                  min={ use12Hour ? 1 : 0 }
                  max={ use12Hour ? 12 : 23 }
                  disabled={ disabled || !selectedDate }
                  onChange={ (next) => updateTime({ hours: next }) }
                />
                <TimeField
                  label={ t("minutes") }
                  value={ minutes }
                  min={ 0 }
                  max={ 59 }
                  disabled={ disabled || !selectedDate }
                  onChange={ (next) => updateTime({ minutes: next }) }
                />
                { showSeconds ? (
                  <TimeField
                    label={ t("seconds") }
                    value={ seconds }
                    min={ 0 }
                    max={ 59 }
                    disabled={ disabled || !selectedDate }
                    onChange={ (next) => updateTime({ seconds: next }) }
                  />
                ) : null }
                { use12Hour ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      { t("period") }
                    </span>
                    <div className="flex h-8 overflow-hidden rounded-lg border">
                      { (["AM", "PM"] as const).map((option) => (
                        <button
                          key={ option }
                          type="button"
                          disabled={ disabled || !selectedDate }
                          className={ cn(
                            "px-2.5 text-xs font-medium transition-colors",
                            meridiem === option
                              ? "bg-primary text-primary-foreground"
                              : "bg-transparent text-muted-foreground hover:bg-muted",
                            disabled || !selectedDate ? "cursor-not-allowed opacity-50" : "",
                          ) }
                          onClick={ () => updateTime({ meridiem: option }) }
                        >
                          { option === "AM" ? t("am") : t("pm") }
                        </button>
                      )) }
                    </div>
                  </div>
                ) : null }
              </div>
              { !selectedDate ? (
                <p className="text-xs text-muted-foreground">
                  { t("selectDateFirst") }
                </p>
              ) : null }
            </div>
          ) : null }

          <div className="flex items-center justify-between gap-2 border-t p-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={ disabled }
              onClick={ handleSetNow }
            >
              { t("now") }
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={ disabled || !selectedDate }
              onClick={ () => setOpen(false) }
            >
              { t("done") }
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      { name ? (
        <input
          type="hidden"
          name={ name }
          value={ hiddenValue }
          required={ required }
        />
      ) : null }
    </div>
  )
}
