import { getClients } from "@/lib/clients"
import { getCompanies } from "@/lib/companies"
import { Company } from "@/lib/types/company"
import { Client } from "@/lib/types/client"
import InvoiceEditor from "@/components/invoice/invoice-editor"
import { createClient } from "@/utils/supabase/server"

export default async function InvoiceNewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isGuest = !user

  const clients: { value: Client; label: string }[] = isGuest
    ? []
    : (await getClients()).map((client: Client) => ({
        value: client,
        label: client.name,
      }))

  const companies: { value: Company; label: string }[] = isGuest
    ? []
    : (await getCompanies()).map((company: Company) => ({
        value: company,
        label: company.name,
      }))

  return (
    <div className="flex min-h-screen justify-center bg-muted p-8">
      <div className="min-h-[297mm] w-[210mm] bg-white p-10 text-sm shadow-xl">
        <InvoiceEditor clients={clients} companies={companies} isGuest={isGuest} />
      </div>
    </div>
  )
}
