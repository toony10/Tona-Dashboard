"use client"

import { type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ListX } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export interface DataTableBulkBarProps {
  count: number
  onClear: () => void
  children: ReactNode
}

export function DataTableBulkBar({
  count,
  onClear,
  children,
}: DataTableBulkBarProps) {
  const t = useTranslations("Table")

  return (
    <AnimatePresence>
      { count > 0 ? (
        <motion.div
          initial={ { opacity: 0, y: 16 } }
          animate={ { opacity: 1, y: 0 } }
          exit={ { opacity: 0, y: 16 } }
          transition={ { duration: 0.2 } }
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-border bg-popover px-4 py-2 shadow-overlay"
        >
          <span className="text-sm font-medium">
            { t("selection.selected", { count }) }
          </span>
          <Button type="button" variant="ghost" size="sm" onClick={ onClear }>
            <ListX data-icon="inline-start" className="size-4" />
            { t("selection.clear") }
          </Button>
          <Separator
            orientation="vertical"
            className="data-vertical:h-5"
          />
          { children }
        </motion.div>
      ) : null }
    </AnimatePresence>
  )
}
