"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type RowSelectionState,
  useReactTable,
} from "@tanstack/react-table"
import { useSearchParams } from "next/navigation"
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"

import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQueryNavigation } from "@/components/providers/query-navigation-provider"

import { DataTableBulkBar } from "./DataTableBulkBar"

const SKELETON_ROW_COUNT = 10

/** Visible against `TableHeader` `bg-primary` in both light and dark themes. */
const HEADER_CHECKBOX_CLASSNAME =
  "border-primary-foreground/80 bg-transparent dark:bg-transparent data-checked:border-primary-foreground data-checked:bg-primary-foreground data-checked:text-primary dark:data-checked:bg-primary-foreground data-[state=indeterminate]:border-primary-foreground data-[state=indeterminate]:bg-primary-foreground data-[state=indeterminate]:text-primary"

export interface DataTableBulkSelection<TData> {
  rows: TData[]
  ids: string[]
  count: number
  clear: () => void
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  enableRowSelection?: boolean
  getRowId?: (row: TData, index: number) => string
  renderBulkActions?: (selection: DataTableBulkSelection<TData>) => ReactNode
}

function defaultGetRowId<TData>(row: TData): string {
  return String((row as { id?: unknown }).id)
}

function createSelectColumn<TData>(
  t: ReturnType<typeof useTranslations>,
): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={ (value) => table.toggleAllPageRowsSelected(!!value) }
        aria-label={ t("selection.selectAllRows") }
        className={ HEADER_CHECKBOX_CLASSNAME }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={ row.getIsSelected() }
        onCheckedChange={ (value) => row.toggleSelected(!!value) }
        aria-label={ t("selection.selectRow") }
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  enableRowSelection = false,
  getRowId,
  renderBulkActions,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("Table")
  const { isPending } = useQueryNavigation()
  const searchParams = useSearchParams()
  const paramsKey = searchParams.toString()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const resolvedGetRowId = useCallback(
    (row: TData, index: number) =>
      getRowId ? getRowId(row, index) : defaultGetRowId(row),
    [getRowId],
  )

  const tableColumns = useMemo(() => {
    if (!enableRowSelection) {
      return columns
    }

    return [createSelectColumn<TData>(t), ...columns]
  }, [columns, enableRowSelection, t])

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: resolvedGetRowId,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    enableRowSelection,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  const clearSelection = useCallback(() => {
    setRowSelection({})
  }, [])

  useEffect(() => {
    if (enableRowSelection) {
      setRowSelection({})
    }
  }, [paramsKey, enableRowSelection])

  const columnCount = table.getAllLeafColumns().length
  const showLoading = isLoading || isPending
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const bulkSelection: DataTableBulkSelection<TData> = {
    rows: selectedRows.map((row) => row.original),
    ids: selectedRows.map((row) => row.id),
    count: selectedCount,
    clear: clearSelection,
  }

  return (
    <>
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
                <TableRow
                  key={ row.id }
                  data-state={ row.getIsSelected() ? "selected" : undefined }
                >
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
      { enableRowSelection && renderBulkActions ? (
        <DataTableBulkBar count={ selectedCount } onClear={ clearSelection }>
          { renderBulkActions(bulkSelection) }
        </DataTableBulkBar>
      ) : null }
    </>
  )
}
