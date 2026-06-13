import { getClients } from "@/lib/clients"
import { getCompanies } from "@/lib/companies"
import { getInvoice } from "@/lib/invoices"
import { Company } from "@/lib/types/company"
import { Client } from "@/lib/types/client"
import InvoiceEditor from "@/components/invoice/invoice-editor"
import { InvoiceEmailDialog } from "@/components/invoice/invoice-email-dialog"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"
import { notFound } from "next/navigation"

export default async function InvoiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [invoice, clients, companies] = await Promise.all([
    getInvoice(id).catch(() => null),
    getClients(),
    getCompanies(),
  ])

  if (!invoice) notFound()

  const clientOptions: { value: Client; label: string }[] = clients.map(
    (c: Client) => ({ value: c, label: c.name })
  )
  const companyOptions: { value: Company; label: string }[] = companies.map(
    (c: Company) => ({ value: c, label: c.name })
  )

  return (
    <div className="flex min-h-screen justify-center bg-muted p-8">
      <div className="flex w-[210mm] flex-col">
        <div className="mb-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/invoice/${invoice.id}/pdf`} download>
              <HugeiconsIcon icon={Download01Icon} />
              Export PDF
            </a>
          </Button>
          <InvoiceEmailDialog invoice={invoice} />
        </div>
        <div className="min-h-[297mm] bg-white p-10 text-sm shadow-xl">
          <InvoiceEditor
            clients={clientOptions}
            companies={companyOptions}
            initialInvoice={invoice}
          />
        </div>
      </div>
    </div>
  )
}
