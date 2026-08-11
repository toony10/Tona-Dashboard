"use client"

import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import { DateInput } from "@/components/shared/forms/DateInput"
import { MainH, SectionH } from "@/components/shared/text/Headings"
import { Button } from "@/components/ui/button"

function ValuePreview({ value }: { value: Date | undefined }) {
  const t = useTranslations("Forms.pages.dateInput")
  const locale = useLocale()
  const dateLocale = locale === "ar" ? ar : enUS

  if (!value) {
    return (
      <p className="text-sm text-muted-foreground">{ t("noDateSelected") }</p>
    )
  }

  return (
    <dl className="grid gap-2 text-sm">
      <div className="flex gap-2">
        <dt className="font-medium text-muted-foreground">
          { t("localLabel") }
        </dt>
        <dd className="font-mono">
          { format(value, "PPP p", { locale: dateLocale }) }
        </dd>
      </div>
      <div className="flex gap-2">
        <dt className="font-medium text-muted-foreground">{ t("isoLabel") }</dt>
        <dd className="font-mono break-all" dir="ltr">
          { value.toISOString() }
        </dd>
      </div>
    </dl>
  )
}

export default function DateInputPage() {
  const t = useTranslations("Forms.pages.dateInput")
  const [controlled, setControlled] = useState<Date | undefined>()
  const [submitted, setSubmitted] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-8">
      <MainH title={ t("title") } description={ t("description") } />

      <div className="grid gap-8 md:grid-cols-2">
        <section className="flex flex-col gap-3">
          <SectionH
            title={ t("dateTimeTitle") }
            description={ t("dateTimeDesc") }
          />
          <DateInput placeholder={ t("schedulePlaceholder") } />
        </section>

        <section className="flex flex-col gap-3">
          <SectionH
            title={ t("dateOnlyTitle") }
            description={ t("dateOnlyDesc") }
          />
          <DateInput
            withTime={ false }
            placeholder={ t("pickDatePlaceholder") }
          />
        </section>

        <section className="flex flex-col gap-3">
          <SectionH
            title={ t("withSecondsTitle") }
            description={ t("withSecondsDesc") }
          />
          <DateInput
            showSeconds
            placeholder={ t("pickDateTimePlaceholder") }
          />
        </section>

        <section className="flex flex-col gap-3">
          <SectionH title={ t("minMaxTitle") } description={ t("minMaxDesc") } />
          <DateInput
            minDate={ new Date() }
            maxDate={ new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
            placeholder={ t("within30DaysPlaceholder") }
          />
        </section>
      </div>

      <section className="flex flex-col gap-3">
        <SectionH
          title={ t("controlledTitle") }
          description={ t("controlledDesc") }
        />
        <DateInput
          value={ controlled }
          onChange={ setControlled }
          placeholder={ t("controlledPlaceholder") }
        />
        <div className="rounded-lg border bg-muted/30 p-4">
          <ValuePreview value={ controlled } />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionH
          title={ t("nativeSubmitTitle") }
          description={ t("nativeSubmitDesc") }
        />
        <form
          className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4"
          onSubmit={ (event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            setSubmitted(String(data.get("eventAt") ?? ""))
          } }
        >
          <DateInput
            name="eventAt"
            required
            placeholder={ t("eventDateTimePlaceholder") }
          />
          <Button type="submit" className="w-fit">
            { t("submitButton") }
          </Button>
        </form>
        { submitted !== null ? (
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="mb-2 text-sm font-medium">
              { t("submittedValueLabel") }
            </p>
            <p className="font-mono text-sm break-all" dir="ltr">
              { submitted || t("emptyValue") }
            </p>
          </div>
        ) : null }
      </section>
    </div>
  )
}
