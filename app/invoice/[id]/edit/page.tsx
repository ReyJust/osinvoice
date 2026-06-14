import type { Metadata } from "next"
import { getClients } from "@/lib/clients"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return { title: id }
}
import { getCompanies } from "@/lib/companies"
import { getInvoice } from "@/lib/invoices"
import { getUserSettings } from "@/lib/user-settings"
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

  const [invoice, clients, companies, settings] = await Promise.all([
    getInvoice(id).catch(() => null),
    getClients(),
    getCompanies(),
    getUserSettings().catch(() => null),
  ])

  if (!invoice) notFound()

  const clientOptions: { value: Client; label: string }[] = clients.map(
    (c: Client) => ({ value: c, label: c.name })
  )
  const companyOptions: { value: Company; label: string }[] = companies.map(
    (c: Company) => ({ value: c, label: c.name })
  )

  return (
    <div className="flex min-h-screen justify-center bg-muted p-2 md:p-8">
      <div className="flex w-full md:w-[210mm] flex-col">
        <div className="mb-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/invoice/${invoice.id}/pdf`} download>
              <HugeiconsIcon icon={Download01Icon} />
              Export PDF
            </a>
          </Button>
          <InvoiceEmailDialog
            invoice={invoice}
            emailBodyTemplate={settings?.email_body_template ?? undefined}
          />
        </div>
        <div className="min-h-[297mm] bg-white p-4 md:p-10 text-sm shadow-xl">
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
