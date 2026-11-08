"use client"

import { useMemo } from "react"
import { DataTable } from "@/components/ui/data-table"
import { getInvoiceColumns } from "./invoice-columns"
import { Invoice } from "@/lib/types/invoice"

export function InvoiceDataTable({
  data,
  emailBodyTemplate,
}: {
  data: Invoice[]
  emailBodyTemplate?: string
}) {
  const columns = useMemo(
    () => getInvoiceColumns(emailBodyTemplate),
    [emailBodyTemplate]
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search by client, company or invoice ID…"
      defaultSort={[{ id: "date", desc: true }]}
    />
  )
}
