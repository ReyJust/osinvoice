import { getTrashedInvoices } from "@/lib/invoices"
import { TrashInvoiceCard } from "@/components/invoice/trash-invoice-card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, Trash } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function TrashPage() {
  const invoices = await getTrashedInvoices()

  return (
    <div>
      <div className="flex items-center gap-3 pb-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/invoice">
            <HugeiconsIcon icon={ArrowLeft01Icon} />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Trash</h1>
      </div>

      {invoices.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Trash} />
            </EmptyMedia>
            <EmptyTitle>Trash is empty</EmptyTitle>
            <EmptyDescription>
              Deleted invoices will appear here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <Button asChild variant="default">
              <Link href="/invoice">Back to invoices</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {invoices.map((invoice) => (
            <TrashInvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  )
}
