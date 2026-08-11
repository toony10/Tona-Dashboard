"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useTranslations } from "next-intl"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQueryNavigation } from "@/components/providers/query-navigation-provider"
import { Skeleton } from "@/components/ui/skeleton"

const SKELETON_ROW_COUNT = 10

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("Table")
  const { isPending } = useQueryNavigation()
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  const columnCount = columns.length
  const showLoading = isLoading || isPending

  return (
    <div className="overflow-hidden rounded-sm border">
      <Table>
        <TableHeader className="bg-primary">
          { table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={ headerGroup.id } className="border-primary/20 hover:bg-transparent">
              { headerGroup.headers.map((header) => (
                <TableHead key={ header.id } className="text-base font-bold text-primary-foreground">
                  { header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    ) }
                </TableHead>
              )) }
            </TableRow>
          )) }
        </TableHeader>
        <TableBody>
          { showLoading ? (
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
              <TableRow key={ `skeleton-${ rowIndex }` }>
                { Array.from({ length: columnCount }).map((_, colIndex) => (
                  <TableCell key={ `skeleton-${ rowIndex }-${ colIndex }` }>
                    <Skeleton className="h-4 w-full bg-primary/10" />
                  </TableCell>
                )) }
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={ columnCount } className="h-24 text-center">
                <span className="text-muted-foreground">{ t("empty") }</span>
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={ row.id }>
                { row.getVisibleCells().map((cell) => (
                  <TableCell key={ cell.id }>
                    { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                  </TableCell>
                )) }
              </TableRow>
            ))
          ) }
        </TableBody>
      </Table>
    </div>
  )
}
