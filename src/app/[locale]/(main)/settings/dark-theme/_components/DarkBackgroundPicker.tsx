"use client"

import { startTransition, useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import { Check, Copy, Moon, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  darkThemePresets,
  defaultDarkThemePresetId,
  getDarkThemePreset,
  getStoredDarkThemePresetId,
  setDarkThemePreset,
  type DarkThemePreset,
  type DarkThemePresetId,
} from "@/config/appearance-settings"
import { cn } from "@/lib/utils"

/** `key` resolves to `Settings.groups.theme.{key}`. */
const presetGroups = [
  {
    key: "neutrals",
    ids: [
      "charcoal",
      "near-black",
      "dark-gray",
      "graphite",
      "zinc",
      "carbon",
      "github",
      "obsidian",
      "oled",
      "taupe",
    ],
  },
  {
    key: "blues",
    ids: [
      "slate-blue",
      "navy",
      "deep-blue",
      "blue-gray",
      "storm",
      "slate",
      "midnight",
      "indigo-night",
      "azure",
      "ocean",
      "ice",
    ],
  },
  {
    key: "greens",
    ids: [
      "teal-dark",
      "forest",
      "olive",
      "emerald",
      "moss",
      "pine",
    ],
  },
  {
    key: "warmTones",
    ids: [
      "espresso",
      "wine",
      "rust",
      "bronze",
      "terracotta",
      "amber",
    ],
  },
  {
    key: "purplesRose",
    ids: [
      "purple-haze",
      "plum",
      "violet",
      "rose",
      "berry",
    ],
  },
] as const satisfies ReadonlyArray<{
  key: string
  ids: readonly DarkThemePresetId[]
}>

/** `near-black` → `nearBlack`, the preset key used under `Settings.presets.theme`. */
function toPresetKey(id: string): string {
  return id.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase())
}

function DashboardPreview({
  color,
  cardColor,
  label,
}: {
  color: string
  cardColor: string
  label: string
}) {
  const t = useTranslations("Settings.picker")

  return (
    <div
      className="relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl shadow-black/30"
      style={ { backgroundColor: color } }
    >
      <div
        className="pointer-events-none absolute -top-16 -end-16 size-48 rounded-full opacity-40 blur-3xl"
        style={ {
          background: `radial-gradient(circle, ${ color } 0%, transparent 70%)`,
        } }
      />
      <div
        className="pointer-events-none absolute -bottom-20 -start-10 size-56 rounded-full opacity-30 blur-3xl"
        style={ {
          background: `radial-gradient(circle, white 0%, transparent 70%)`,
        } }
      />

      <div className="relative flex min-h-56 sm:min-h-64">
        <div className="flex w-14 shrink-0 flex-col gap-3 border-e border-white/10 bg-black/15 p-3 sm:w-16">
          <div className="size-7 rounded-lg bg-white/15" />
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-white/20" />
            <div className="h-2 w-4/5 rounded-full bg-white/10" />
            <div className="h-2 w-3/5 rounded-full bg-white/10" />
            <div className="h-2 w-4/5 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
          <div className="space-y-2">
            <div className="h-3 w-28 rounded-full bg-white/25" />
            <div className="h-2 w-40 max-w-full rounded-full bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            { Array.from({ length: 4 }).map((_, index) => (
              <div
                key={ index }
                className="rounded-xl border border-white/10 p-3 backdrop-blur-sm"
                style={ { backgroundColor: cardColor } }
              >
                <div className="mb-2 h-2 w-8 rounded-full bg-white/20" />
                <div className="h-4 w-12 rounded-full bg-white/30" />
              </div>
            )) }
          </div>

          <div className="mt-auto grid gap-2 sm:grid-cols-2">
            <div
              className="h-16 rounded-xl border border-white/10"
              style={ { backgroundColor: cardColor } }
            />
            <div
              className="h-16 rounded-xl border border-white/10"
              style={ { backgroundColor: cardColor } }
            />
          </div>
        </div>
      </div>

      <div className="relative flex items-end justify-between gap-4 border-t border-white/10 bg-black/20 px-4 py-3 sm:px-5 sm:py-4">
        <div>
          <p className="text-[11px] font-medium tracking-[0.2em] text-white/50 uppercase">
            { t("livePreview") }
          </p>
          <p className="text-sm font-semibold text-white">{ label }</p>
        </div>
        <code
          className="rounded-lg bg-black/30 px-2.5 py-1 text-xs text-white/80"
          dir="ltr"
        >
          { color }
        </code>
      </div>
    </div>
  )
}

function SwatchButton({
  preset,
  label,
  isSelected,
  onSelect,
}: {
  preset: DarkThemePreset
  label: string
  isSelected: boolean
  onSelect: (id: DarkThemePresetId) => void
}) {
  const t = useTranslations("Settings.picker")

  return (
    <button
      type="button"
      onClick={ () => onSelect(preset.id) }
      className={ cn(
        "group relative flex flex-col items-center gap-2 rounded-2xl p-2 text-center transition-all duration-300",
        "hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected && "scale-[1.02]",
      ) }
      aria-pressed={ isSelected }
      aria-label={ t("useThemeAria", { label }) }
      style={ {
        boxShadow: isSelected
          ? `0 0 0 1px ${ preset.value }, 0 12px 30px -12px ${ preset.value }`
          : undefined,
      } }
    >
      <span
        className={ cn(
          "relative size-14 overflow-hidden rounded-2xl border border-white/10 transition-transform duration-300 sm:size-16",
          "group-hover:scale-105",
          isSelected && "ring-2 ring-white/30",
        ) }
        style={ { backgroundColor: preset.value } }
      >
        <span
          className="absolute inset-x-2 bottom-2 top-[42%] rounded-md border border-white/10 shadow-sm"
          style={ { backgroundColor: preset.card } }
        />
        <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_50%)]" />
        { isSelected ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
            <Check className="size-4 text-white drop-shadow-sm" />
          </span>
        ) : null }
      </span>
      <span
        className={ cn(
          "max-w-22 truncate text-xs font-medium transition-colors",
          isSelected ? "text-foreground" : "text-muted-foreground",
        ) }
      >
        { label }
      </span>
    </button>
  )
}

export function DarkBackgroundPicker() {
  const t = useTranslations("Settings.picker")
  const tPresets = useTranslations("Settings.presets")
  const tGroups = useTranslations("Settings.groups")
  const { resolvedTheme } = useTheme()
  const [selectedPresetId, setSelectedPresetId] = useState<DarkThemePresetId>(
    defaultDarkThemePresetId,
  )
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    startTransition(() => {
      setSelectedPresetId(getStoredDarkThemePresetId())
      setMounted(true)
    })
  }, [])

  const selectedPreset = useMemo(
    () => getDarkThemePreset(selectedPresetId),
    [selectedPresetId],
  )

  const themeLabel = (id: DarkThemePresetId) =>
    tPresets(`theme.${ toPresetKey(id) }`)

  const groupedPresets = useMemo(() => {
    const presetById = new Map(
      darkThemePresets.map((preset) => [preset.id, preset]),
    )

    return presetGroups.map((group) => ({
      ...group,
      presets: group.ids.flatMap((id) => {
        const preset = presetById.get(id)
        return preset ? [preset] : []
      }),
    }))
  }, [])

  function handleSelect(id: DarkThemePresetId) {
    setSelectedPresetId(id)
    setDarkThemePreset(id, resolvedTheme)
  }

  async function copyHex(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(t("copiedToast", { label }))
    } catch {
      toast.error(t("copyErrorToast"))
    }
  }

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="size-4" />
            <span className="text-xs font-semibold tracking-[0.24em] uppercase">
              { t("canvasPreview") }
            </span>
          </div>
          { mounted ? (
            <DashboardPreview
              color={ selectedPreset.value }
              cardColor={ selectedPreset.card }
              label={ themeLabel(selectedPreset.id) }
            />
          ) : (
            <div className="min-h-56 animate-pulse rounded-[1.75rem] bg-muted sm:min-h-64" />
          ) }
        </section>

        <section className="rounded-[1.75rem] border bg-card/60 p-5 backdrop-blur-sm sm:p-6">
          <div className="mb-5 space-y-2">
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              { t("activeAtmosphere") }
            </h2>
            <p className="text-sm text-muted-foreground">
              { t("activeAtmosphereDesc") }
            </p>
          </div>

          <div className="mb-5 flex items-center gap-3 rounded-2xl border bg-muted/30 p-3">
            <span
              className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-foreground/10 shadow-inner"
              style={ { backgroundColor: selectedPreset.value } }
            >
              <span
                className="absolute inset-x-1.5 bottom-1.5 top-[45%] rounded-md border border-white/10"
                style={ { backgroundColor: selectedPreset.card } }
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                { themeLabel(selectedPreset.id) }
              </p>
              <p className="truncate text-xs text-muted-foreground">
                { t("pairedSubtitle") }
              </p>
            </div>
          </div>

          <div className="mb-5 space-y-2">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/20 px-3 py-2">
              <span
                className="size-6 shrink-0 rounded-md border border-foreground/10"
                style={ { backgroundColor: selectedPreset.value } }
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  { t("canvasLabel") }
                </p>
                <p
                  className="truncate font-mono text-xs"
                  dir="ltr"
                >
                  { selectedPreset.value }
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={ () =>
                  copyHex(selectedPreset.value, t("canvasColorCopyLabel"))
                }
                aria-label={ t("copyCanvasAria") }
              >
                <Copy className="size-3.5" />
              </Button>
            </div>

            <div className="flex items-center gap-3 rounded-xl border bg-muted/20 px-3 py-2">
              <span
                className="size-6 shrink-0 rounded-md border border-foreground/10"
                style={ { backgroundColor: selectedPreset.card } }
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  { t("cardsLabel") }
                </p>
                <p
                  className="truncate font-mono text-xs"
                  dir="ltr"
                >
                  { selectedPreset.card }
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={ () =>
                  copyHex(selectedPreset.card, t("cardColorCopyLabel"))
                }
                aria-label={ t("copyCardAria") }
              >
                <Copy className="size-3.5" />
              </Button>
            </div>
          </div>

          { mounted && !isDark ? (
            <div className="flex items-start gap-3 rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-4">
              <Moon className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                { t("switchToDarkHint") }
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
              <span className="size-2 rounded-full bg-emerald-500" />
              { t("liveOnDashboard") }
            </div>
          ) }
        </section>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            { t("themeColorsTitle") }
          </h2>
          <p className="text-sm text-muted-foreground">
            { t("themeColorsDesc") }
          </p>
        </div>

        { groupedPresets.map((group) => (
          <section key={ group.key } className="space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="font-heading text-base font-semibold">
                  { tGroups(`theme.${ group.key }.title`) }
                </h3>
                <p className="text-sm text-muted-foreground">
                  { tGroups(`theme.${ group.key }.description`) }
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                { t("presetsCountTemplate", { count: group.presets.length }) }
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              { group.presets.map((preset) => (
                <SwatchButton
                  key={ preset.id }
                  preset={ preset }
                  label={ themeLabel(preset.id) }
                  isSelected={ mounted && selectedPresetId === preset.id }
                  onSelect={ handleSelect }
                />
              )) }
            </div>
          </section>
        )) }
      </div>
    </div>
  )
}
