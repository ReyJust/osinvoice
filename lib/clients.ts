  import { createClient } from "@/utils/supabase/server"
  import { requireUser } from "@/utils/supabase/require-user"
  import { Client } from "@/lib/types/client"

  export const getClients = async (search?: string): Promise<Client[]> => {
    const supabase = await createClient()

    const user = await requireUser()

    let query = supabase.from("clients").select("*").eq("user_id", user.id)

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    const { data } = await query
    return data || []
  }
