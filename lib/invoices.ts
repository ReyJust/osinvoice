import { createClient } from "@/utils/supabase/server"
import { requireUser } from "@/utils/supabase/require-user"
import { Invoice, InvoiceLine } from "./types/invoice"

export type GroupedInvoices = {
  month: string
  items: Invoice[]
}

export const getInvoices = async (search?: string): Promise<Invoice[]> => {
  const supabase = await createClient()
  const user = await requireUser()

  let query = supabase
    .from("invoice_search")
    .select("*")
    .eq("deleted", false)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (search) {
    query = query.or(
      `company_name.ilike.%${search}%,client_name.ilike.%${search}%`
    )
  }

  const { data, error } = await query

  if (error) throw error

  // remove company and client names
  return data.map((row) => ({
    // ...row,
    client: row.client,
    company: row.company,
    created_at: row.created_at,
    date: row.date,
    deleted: row.deleted,
    id: row.id,
    notes: row.notes,
    status: row.status,
    user_id: row.user_id,
    lines: row.lines as InvoiceLine[],
  })) as any as Invoice[]
}

export const groupInvoicesByMonth = (
  invoices: Invoice[]
): GroupedInvoices[] => {
  const groups = new Map<string, Invoice[]>()

  for (const invoice of invoices) {
    const d = new Date(invoice.created_at)

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`

    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(invoice)
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a)) // newest first
    .map(([key, items]) => ({
      month: key,
      items,
    }))
}

export const getInvoice = async (id: string): Promise<Invoice> => {
  const supabase = await createClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from("invoices")
    .select(`*, company:companies (*), client:clients (*)`)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) throw error

  return {
    ...data,
    lines: data.lines as InvoiceLine[],
  } as any as Invoice
}

export const getTrashedInvoices = async (): Promise<Invoice[]> => {
  const supabase = await createClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      company:companies (*),
      client:clients (*)`
    )
    .eq("deleted", true)
    .eq("user_id", user.id)

  if (error) throw error

  return data.map((row) => ({
    ...row,
    lines: row.lines as InvoiceLine[],
  }))
}
