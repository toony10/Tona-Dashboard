"use client"

import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { StatusIndicator } from "@/components/shared/status"
import { DataTable } from "@/components/shared/table/DataTable"
import { Button } from "@/components/ui/button"
import { EditIcon, EyeIcon, TrashIcon } from "lucide-react"

export type Product = {
  id: string
  name: string
  category: string
  price: number
  status: "active" | "draft" | "archived"
}

/** `PRD-001` → `prd001`, the demo product key under `Table.products`. */
function toProductKey(id: string): string {
  return id.toLowerCase().replace(/[^a-z0-9]/g, "")
}

interface ProductsTableProps {
  data: Product[]
  isLoading?: boolean
  enableRowSelection?: boolean
}

export function ProductsTable({
  data,
  isLoading,
  enableRowSelection = false,
}: ProductsTableProps) {
  const t = useTranslations("Table")

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "id",
        header: t("columns.id"),
        cell: ({ row }) => (
          <span dir="ltr">{ row.getValue<string>("id") }</span>
        ),
      },
      {
        accessorKey: "name",
        header: t("columns.product"),
        cell: ({ row }) => {
          const key = `products.${ toProductKey(row.original.id) }.name`
          return t.has(key) ? t(key) : row.getValue<string>("name")
        },
      },
      {
        accessorKey: "category",
        header: t("columns.category"),
        cell: ({ row }) => {
          const key = `products.${ toProductKey(row.original.id) }.category`
          return t.has(key) ? t(key) : row.getValue<string>("category")
        },
      },
      {
        accessorKey: "price",
        header: t("columns.price"),
        cell: ({ row }) => {
          const price = row.getValue<number>("price")
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(price)

          return <span dir="ltr">{ formatted }</span>
        },
      },
      {
        accessorKey: "status",
        header: t("columns.status"),
        cell: ({ row }) => {
          const status = row.getValue<Product["status"]>("status")
          return <StatusIndicator status={ status } label={ t(`status.${ status }`) } className="capitalize" />
        },
      },
      {
        id: "actions",
        header: "",
        cell: () => {
          return (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <EditIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <TrashIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <EyeIcon className="h-4 w-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    [t],
  )

  return (
    <DataTable
      columns={ columns }
      data={ data }
      isLoading={ isLoading }
      enableRowSelection={ enableRowSelection }
      getRowId={ (product) => product.id }
      renderBulkActions={ ({ count, clear }) => (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={ () => {
            toast.success(t("bulk.deletedToast", { count }))
            clear()
          } }
        >
          { t("bulk.deleteSelected") }
        </Button>
      ) }
    />
  )
}
