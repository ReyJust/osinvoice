import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

import { Invoice } from "@/lib/types/invoice"
import { InvoiceCard } from "@/components/invoice/invoice-card"

const invoices: Invoice[] = [
  {
    id: 1,
    description: "asdfasdf",
    company_id: 1,
    client_id: 1,
    created_at: new Date(),
    lines: [],
    notes: "",
    status: "draft",
  },
]

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // const { data: todos } = await supabase.from("todos").select()
  // console.log("todos", todos)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        {invoices.map((invoice) => {
          return <InvoiceCard key={invoice.id} invoice={invoice} />
        })}
      </div>
    </div>
  )
}
