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

export async function searchClients(search: string) {
  console.log("QUERY: ", search)
  await getClients(search)

  revalidatePath("/client")
}
