import { createClient } from "@/utils/supabase/server"
import { requireUser } from "@/utils/supabase/require-user"
import { Company } from "@/lib/types/company"

export const getCompanies = async (search?: string): Promise<Company[]> => {
  const supabase = await createClient()
  const user = await requireUser()

  let query = supabase
    .from("companies")
    .select("*")
    .eq("user_id", user.id)

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  const { data } = await query

  return data || []
}
