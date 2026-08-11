"use client"

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useQueryNavigation } from "@/components/providers/query-navigation-provider"
import { cn } from "@/lib/utils"
import { FILTER_URL_UPDATE_DELAY_MS } from "@/config/constants"
import { debounce, parseAsInteger, useQueryState } from "nuqs"

type PageItem = number | "ellipsis"

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 1) {
    return [1]
  }

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items: PageItem[] = [1]

  if (currentPage > 3) {
    items.push("ellipsis")
  }

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let page = start; page <= end; page += 1) {
    items.push(page)
  }

  if (currentPage < totalPages - 2) {
    items.push("ellipsis")
  }

  items.push(totalPages)

  return items
}

export interface PaginationProps {
  pages?: number
  paramKey?: string
  className?: string
}

export function Pagination({
  pages = 100,
  paramKey = "page",
  className,
}: PaginationProps) {
  const { isPending, startTransition } = useQueryNavigation()
  const [page, setPage] = useQueryState(
    paramKey,
    parseAsInteger.withDefault(1).withOptions({
      limitUrlUpdates: debounce(FILTER_URL_UPDATE_DELAY_MS),
    }),
  )

  const totalPages = Math.max(1, pages)
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const pageItems = getPageItems(currentPage, totalPages)

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return
    }

    setPage(nextPage, {
      limitUrlUpdates: debounce(FILTER_URL_UPDATE_DELAY_MS),
      startTransition,
    })
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <PaginationRoot
      className={ cn(isPending && "pointer-events-none opacity-50", className) }
      aria-busy={ isPending }
    >
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={ cn(currentPage <= 1 && "pointer-events-none opacity-50") }
            onClick={ (event) => {
              event.preventDefault()
              goToPage(currentPage - 1)
            } }
          />
        </PaginationItem>

        { pageItems.map((item, index) => (
          <PaginationItem key={ item === "ellipsis" ? `ellipsis-${ index }` : item }>
            { item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={ item === currentPage }
                onClick={ (event) => {
                  event.preventDefault()
                  goToPage(item)
                } }
              >
                { item }
              </PaginationLink>
            ) }
          </PaginationItem>
        )) }

        <PaginationItem>
          <PaginationNext
            href="#"
            className={ cn(currentPage >= totalPages && "pointer-events-none opacity-50") }
            onClick={ (event) => {
              event.preventDefault()
              goToPage(currentPage + 1)
            } }
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  )
}
