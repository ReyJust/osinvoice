"use server"

import { createClient } from "@/utils/supabase/server"
import { requireUser } from "@/utils/supabase/require-user"
import { revalidatePath } from "next/cache"

export async function saveEmailTemplate(formData: FormData) {
  const template = formData.get("template") as string
  const supabase = await createClient()
  const user = await requireUser()

  const { error } = await supabase.from("user_settings").upsert(
    {
      user_id: user.id,
      email_body_template: template,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  if (error) throw new Error(error.message)

  revalidatePath("/settings")
}
