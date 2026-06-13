import { getClients } from "@/lib/clients"
import { getCompanies } from "@/lib/companies"
import { getInvoice } from "@/lib/invoices"
import { Company } from "@/lib/types/company"
import { Client } from "@/lib/types/client"
import InvoiceEditor from "@/components/invoice/invoice-editor"
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
      <div className="min-h-[297mm] w-[210mm] bg-white p-10 text-sm shadow-xl">
        <InvoiceEditor
          clients={clientOptions}
          companies={companyOptions}
          initialInvoice={invoice}
        />
      </div>
    </div>
  )
}
