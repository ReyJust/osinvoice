"use client"

import { DataTable } from "@/components/ui/data-table"
import { trashInvoiceColumns } from "./trash-invoice-columns"
import { Invoice } from "@/lib/types/invoice"

export function TrashInvoiceDataTable({ data }: { data: Invoice[] }) {
  return (
    <DataTable
      columns={trashInvoiceColumns}
      data={data}
      searchPlaceholder="Search trash…"
      defaultSort={[{ id: "date", desc: true }]}
    />
  )
}
