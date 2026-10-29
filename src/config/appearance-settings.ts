export const DARK_THEME_STORAGE_KEY = "dashboard-dark-background"
const LEGACY_DARK_CARD_STORAGE_KEY = "dashboard-dark-card"

/** Ids are stable lookup keys — labels live in `Settings.presets.theme.*`. */
export const darkThemePresets = [
  { id: "night-indigo", value: "#0F1226", card: "#171B34" },
  { id: "material", value: "#121212", card: "#1E1E1E" },
  { id: "oled", value: "#050505", card: "#141414" },
  { id: "zinc", value: "#18181B", card: "#27272A" },
  { id: "charcoal", value: "#2C2C2C", card: "#363636" },
  { id: "github", value: "#0D1117", card: "#161B22" },
  { id: "slate", value: "#1E293B", card: "#334155" },
  { id: "midnight", value: "#1A1A2E", card: "#252538" },
  { id: "nord", value: "#2E3440", card: "#3B4252" },
  { id: "dracula", value: "#282A36", card: "#343746" },
] as const

export type DarkThemePresetId = (typeof darkThemePresets)[number]["id"]

export type DarkThemePreset = {
  id: DarkThemePresetId
  value: string
  card: string
}

export const defaultDarkThemePresetId: DarkThemePresetId = "night-indigo"

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
