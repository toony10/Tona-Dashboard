export const DARK_THEME_STORAGE_KEY = "dashboard-dark-background"
const LEGACY_DARK_CARD_STORAGE_KEY = "dashboard-dark-card"

/** Ids are stable lookup keys — labels live in `Settings.presets.theme.*`. */
export const darkThemePresets = [
  { id: "charcoal", value: "#2C2C2C", card: "#363636" },
  { id: "near-black", value: "#0F0E0E", card: "#1A1A1A" },
  { id: "slate-blue", value: "#2C3947", card: "#354555" },
  { id: "navy", value: "#30364F", card: "#3D4463" },
  { id: "dark-gray", value: "#222222", card: "#2E2E2E" },
  { id: "deep-blue", value: "#132440", card: "#1C3458" },
  { id: "blue-gray", value: "#213448", card: "#2A3A4A" },
  { id: "graphite", value: "#2D2D2D", card: "#3A3A3A" },
  { id: "zinc", value: "#18181B", card: "#27272A" },
  { id: "carbon", value: "#161616", card: "#212121" },
  { id: "github", value: "#0D1117", card: "#161B22" },
  { id: "midnight", value: "#1A1A2E", card: "#252538" },
  { id: "indigo-night", value: "#1E1E2F", card: "#2A2A3D" },
  { id: "purple-haze", value: "#1A1625", card: "#2A2438" },
  { id: "storm", value: "#1C2833", card: "#243040" },
  { id: "teal-dark", value: "#152825", card: "#1F3834" },
  { id: "forest", value: "#172121", card: "#1F2B2B" },
  { id: "olive", value: "#1C1F18", card: "#2A3024" },
  { id: "espresso", value: "#2C1810", card: "#3A2820" },
  { id: "wine", value: "#2A1A1F", card: "#35252B" },
  { id: "slate", value: "#1E293B", card: "#334155" },
  { id: "obsidian", value: "#0B0F14", card: "#151A20" },
] as const

export type DarkThemePresetId = (typeof darkThemePresets)[number]["id"]

export type DarkThemePreset = {
  id: DarkThemePresetId
  value: string
  card: string
}

export const defaultDarkThemePresetId: DarkThemePresetId = "charcoal"

const themePresetMap = Object.fromEntries(
  darkThemePresets.map((preset) => [
    preset.id,
    { value: preset.value, card: preset.card },
  ]),
) as Record<DarkThemePresetId, { value: string; card: string }>

export function isDarkThemePresetId(
  value: string,
): value is DarkThemePresetId {
  return value in themePresetMap
}

export function getStoredDarkThemePresetId(): DarkThemePresetId {
  if (typeof window === "undefined") {
    return defaultDarkThemePresetId
  }

  const stored = localStorage.getItem(DARK_THEME_STORAGE_KEY)
  if (stored && isDarkThemePresetId(stored)) {
    return stored
  }

  return defaultDarkThemePresetId
}

export function getDarkThemePreset(id: DarkThemePresetId): DarkThemePreset {
  return (
    darkThemePresets.find((preset) => preset.id === id) ?? darkThemePresets[0]
  )
}

export function isDarkTheme(theme: string | undefined): boolean {
  return theme === "dark"
}

function clearLegacyCardStorage(): void {
  localStorage.removeItem(LEGACY_DARK_CARD_STORAGE_KEY)
}

export function applyDarkAppearance(
  options?: {
    presetId?: DarkThemePresetId
    theme?: string | undefined
  },
): void {
  if (typeof window === "undefined") {
    return
  }

  clearLegacyCardStorage()

  const html = document.documentElement
  const isDark =
    options?.theme !== undefined
      ? isDarkTheme(options.theme)
      : html.classList.contains("dark")

  if (!isDark) {
    html.style.removeProperty("--background")
    html.style.removeProperty("--card")
    return
  }

  const presetId = options?.presetId ?? getStoredDarkThemePresetId()
  const preset =
    themePresetMap[presetId] ?? themePresetMap[defaultDarkThemePresetId]

  html.style.setProperty("--background", preset.value)
  html.style.setProperty("--card", preset.card)
}

export function setDarkThemePreset(
  id: DarkThemePresetId,
  theme?: string | undefined,
): void {
  localStorage.setItem(DARK_THEME_STORAGE_KEY, id)
  applyDarkAppearance({ presetId: id, theme })
}

export function getAppearanceInitScript(): string {
  const presets = JSON.stringify(themePresetMap)

  return `(function(){try{var key=${JSON.stringify(DARK_THEME_STORAGE_KEY)};var legacyCardKey=${JSON.stringify(LEGACY_DARK_CARD_STORAGE_KEY)};var presets=${presets};var defaultId=${JSON.stringify(defaultDarkThemePresetId)};var id=localStorage.getItem(key)||defaultId;var preset=presets[id]||presets[defaultId];var theme=localStorage.getItem("theme");var isDark=theme==="dark"||(theme!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(!isDark)return;var html=document.documentElement;html.style.setProperty("--background",preset.value);html.style.setProperty("--card",preset.card);try{localStorage.removeItem(legacyCardKey)}catch(e){}}catch(e){}})();`
}
