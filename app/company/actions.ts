"use server"

import { createClient } from "@/utils/supabase/server"

import { revalidatePath } from "next/cache"
import { CompanyInput } from "@/lib/types/company"

export const createCompany = async (newCompany: CompanyInput) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { error } = await supabase
    .from("companies")
    .insert({
      name: newCompany.name,
      email: newCompany.email,
      address: newCompany.address,
      city: newCompany.city,
      state: newCompany.state,
      postcode: newCompany.postcode,
      country: newCompany.country,
      bsb: newCompany.bsb,
      account_number: newCompany.account_number,
      user_id: user?.id,
    })
    .select()
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/company")
}

export const updateCompany = async (id: number, data: CompanyInput) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from("companies")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)
  revalidatePath("/company")
}

export const deleteCompany = async (id: number) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)
  revalidatePath("/company")
}
