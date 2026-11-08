"use client"

import { useMemo } from "react"
import { DataTable } from "@/components/ui/data-table"
import { getInvoiceColumns } from "./invoice-columns"
import { Invoice } from "@/lib/types/invoice"
import { EmailTemplates } from "@/lib/email-template"

export function InvoiceDataTable({
  data,
  emailTemplates,
}: {
  data: Invoice[]
  emailTemplates?: EmailTemplates
}) {
  const columns = useMemo(
    () => getInvoiceColumns(emailTemplates),
    [emailTemplates]
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
