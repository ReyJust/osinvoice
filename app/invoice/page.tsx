import type { Metadata } from "next"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { LegalDocument02Icon } from "@hugeicons/core-free-icons"

export const metadata: Metadata = { title: "Invoices" }

import CreateInvoiceButton from "@/components/invoice/create-invoice-button"
import { getInvoices } from "@/lib/invoices"
import { InvoiceDataTable } from "@/components/invoice/invoice-data-table"

export default async function Page() {
  const invoices = await getInvoices()

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <CreateInvoiceButton />
      </div>

      {invoices.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={LegalDocument02Icon} />
            </EmptyMedia>
            <EmptyTitle>No Invoices Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any invoices yet. Get started by creating
              your first invoice.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <CreateInvoiceButton />
          </EmptyContent>
        </Empty>
      ) : (
        <InvoiceDataTable data={invoices} />
      )}
    </div>
  )
}
