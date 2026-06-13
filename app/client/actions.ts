"use server"

import { createClient as createDbClient } from "@/utils/supabase/server"
import { getClients } from "@/lib/clients"

import { revalidatePath } from "next/cache"
import { ClientInput } from "@/lib/types/client"

export const createClient = async (newClient: ClientInput) => {
  const supabase = await createDbClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { error } = await supabase
    .from("clients")
    .insert({
      name: newClient.name,
      email: newClient.email,
      address: newClient.address,
      city: newClient.city,
      postcode: newClient.postcode,
      state: newClient.state,
      country: newClient.country,
      user_id: user?.id,
    })
    .select()
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/client")
}

export const updateClient = async (id: number, data: ClientInput) => {
  const supabase = await createDbClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from("clients")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)
  revalidatePath("/client")
}

export const deleteClient = async (id: number) => {
  const supabase = await createDbClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)
  revalidatePath("/client")
}
