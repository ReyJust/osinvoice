"use server"

import { createClient } from "@/utils/supabase/server"
import { requireUser } from "@/utils/supabase/require-user"
import { revalidatePath } from "next/cache"
import { Invoice, InvoiceInput } from "@/lib/types/invoice"

export const createInvoice = async (newInvoice: InvoiceInput) => {
  const supabase = await createClient()
  const user = await requireUser()

  if (!user) return

  const { error } = await supabase
    .from("invoices")
    .insert({
      id: newInvoice.id,
      company_id: newInvoice.company?.id,
      lines: newInvoice.lines ?? [],
      notes: newInvoice.notes ?? "",
      client_id: newInvoice.client?.id,
      date: newInvoice.date.toISOString(),
      user_id: user?.id,
      status: "unpaid",
    })
    .select()
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/invoice")
}

export const updateInvoice = async (id: string, updatedInvoice: InvoiceInput) => {
  const supabase = await createClient()
  const user = await requireUser()

  if (!user) return

  const { error } = await supabase
    .from("invoices")
    .update({
      company_id: updatedInvoice.company?.id,
      lines: updatedInvoice.lines ?? [],
      notes: updatedInvoice.notes ?? "",
      client_id: updatedInvoice.client?.id,
      date: (updatedInvoice.date as any).toISOString
        ? (updatedInvoice.date as any).toISOString()
        : updatedInvoice.date,
      status: updatedInvoice.status,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)

  revalidatePath("/invoice")
}

export const moveInvoiceToTrash = async (invoiceId: string) => {
  const supabase = await createClient()
  const user = await requireUser()

  if (!user) return

  const { error } = await supabase
    .from("invoices")
    .update({ deleted: true })
    .eq("id", invoiceId)
    .eq("user_id", user?.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/invoice")
}

export const restoreInvoiceFromTrash = async (invoiceId: string) => {
  const supabase = await createClient()
  const user = await requireUser()

  if (!user) return

  const { error } = await supabase
    .from("invoices")
    .update({ deleted: false })
    .eq("id", invoiceId)
    .eq("user_id", user?.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/invoice")
}

export const deleteInvoicePermanently = async (invoiceId: string) => {
  const supabase = await createClient()
  const user = await requireUser()

  if (!user) return

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId)
    .eq("user_id", user?.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/invoice")
}

export const changeInvoiceStatus = async (
  invoiceId: string,
  newStatus: Invoice["status"]
) => {
  const supabase = await createClient()
  const user = await requireUser()

  if (!user) return

  const { error } = await supabase
    .from("invoices")
    .update({ status: newStatus })
    .eq("id", invoiceId)
    .eq("user_id", user?.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/invoice")
}
