import { InvoiceCard } from "@/components/invoice/invoice-card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { LegalDocument02Icon, Search01Icon } from "@hugeicons/core-free-icons"

import CreateInvoiceButton from "@/components/invoice/create-invoice-button"
import {
  getInvoices,
  groupInvoicesByMonth,
  type GroupedInvoices,
} from "@/lib/invoices"
import { SearchSection } from "@/components/search-section"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams

  const invoices = await getInvoices(search)
  const groupedInvoices = groupInvoicesByMonth(invoices)

  return (
    <div className="">
      <h1 className="pb-4 text-2xl font-bold">Invoices</h1>
      {invoices.length == 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon
                icon={LegalDocument02Icon}
                // className="text-muted-foreground"
                // size={24}
                // color="#FFFFFF"
                // strokeWidth={1.5}
              />
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
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <SearchSection />
            <CreateInvoiceButton />
          </div>
          <div className="flex flex-col gap-8">
            {groupedInvoices.map((group) => (
              <div key={group.month} className="flex flex-col gap-4">
                {/* Month label */}
                <h2 className="text-lg font-semibold">
                  {new Date(`${group.month}-01`).toLocaleString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>

                {/* Cards grid */}
                <div className="grid gap-4 md:grid-cols-3">
                  {group.items.map((invoice) => (
                    <InvoiceCard key={invoice.id} invoice={invoice} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
