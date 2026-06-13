"use client"

import { DataTable } from "@/components/ui/data-table"
import { invoiceColumns } from "./invoice-columns"
import { Invoice } from "@/lib/types/invoice"

export function InvoiceDataTable({ data }: { data: Invoice[] }) {
  return (
    <DataTable
      columns={invoiceColumns}
      data={data}
      searchPlaceholder="Search by client, company or invoice ID…"
      defaultSort={[{ id: "date", desc: true }]}
    />
  )
}
