"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type Row,
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
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  getRowId?: (row: TData, index: number) => string
  renderBulkActions?: (selection: DataTableBulkSelection<TData>) => ReactNode
}

function defaultGetRowId<TData>(row: TData): string {
  return String((row as { id?: unknown }).id)
}

function createSelectColumn<TData>(
  t: ReturnType<typeof useTranslations<"Table">>,
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={ row.getIsSelected() }
        disabled={ !row.getCanSelect() }
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

  const selectionEnabled = Boolean(enableRowSelection)

  const resolvedGetRowId = useCallback(
    (row: TData, index: number) =>
      getRowId ? getRowId(row, index) : defaultGetRowId(row),
    [getRowId],
  )

  const tableColumns = useMemo(() => {
    if (!selectionEnabled) {
      return columns
    }

    return [createSelectColumn<TData>(t), ...columns]
  }, [columns, selectionEnabled, t])

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
    if (selectionEnabled) {
      setRowSelection({})
    }
  }, [paramsKey, selectionEnabled])

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
      <div
        aria-busy={ showLoading }
        className="overflow-hidden rounded-xl border border-border bg-card shadow-card"
      >
        <Table className="min-w-full">
          <TableHeader className="bg-surface-low">
            { table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={ headerGroup.id }
                className="border-border hover:bg-transparent"
              >
                { headerGroup.headers.map((header) => (
                  <TableHead
                    key={ header.id }
                    className="h-10 px-4 text-[0.8125rem] font-semibold text-muted-foreground first:ps-5 last:pe-5"
                  >
                    { header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      ) }
                  </TableHead>
                )) }
              </TableRow>
            )) }
          </TableHeader>
          <TableBody>
            { showLoading ? (
              Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
                <TableRow
                  key={ `skeleton-${ rowIndex }` }
                  className="border-border hover:bg-transparent"
                >
                  { Array.from({ length: columnCount }).map((_, colIndex) => (
                    <TableCell
                      key={ `skeleton-${ rowIndex }-${ colIndex }` }
                      className="h-(--row-h) px-4 first:ps-5 last:pe-5"
                    >
                      <Skeleton className="h-4 w-full max-w-40" />
                    </TableCell>
                  )) }
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={ columnCount }
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  { t("empty") }
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={ row.id }
                  data-state={ row.getIsSelected() ? "selected" : undefined }
                  className="border-border hover:bg-primary/4 data-[state=selected]:bg-accent data-[state=selected]:hover:bg-accent"
                >
                  { row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={ cell.id }
                      className="h-(--row-h) px-4 text-sm first:ps-5 last:pe-5"
                    >
                      { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                    </TableCell>
                  )) }
                </TableRow>
              ))
            ) }
          </TableBody>
        </Table>
      </div>
      { selectionEnabled && renderBulkActions ? (
        <DataTableBulkBar count={ selectedCount } onClear={ clearSelection }>
          { renderBulkActions(bulkSelection) }
        </DataTableBulkBar>
      ) : null }
    </>
  )
}
