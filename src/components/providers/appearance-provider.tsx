"use client"

import { useTheme } from "next-themes"
import { useLayoutEffect } from "react"

import { applyDarkAppearance } from "@/config/appearance-settings"

export function AppearanceProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { resolvedTheme } = useTheme()

  useLayoutEffect(() => {
    if (resolvedTheme === undefined) {
      return
    }

    applyDarkAppearance({ theme: resolvedTheme })
  }, [resolvedTheme])

  return children
}
