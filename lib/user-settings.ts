import { createClient } from "@/utils/supabase/server"
import { requireUser } from "@/utils/supabase/require-user"

export async function getUserSettings() {
  const supabase = await createClient()
  const user = await requireUser()

  const { data } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  return data
}
