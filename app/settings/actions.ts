"use server"

import { createClient } from "@/utils/supabase/server"
import { requireUser } from "@/utils/supabase/require-user"
import { revalidatePath } from "next/cache"

export async function updateProfile(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const name = formData.get("name") as string
  const surname = formData.get("surname") as string
  const supabase = await createClient()
  await requireUser()

  const { error } = await supabase.auth.updateUser({
    data: { name, surname },
  })

  if (error) return error.message

  revalidatePath("/settings")
  return null
}

export async function saveEmailTemplate(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
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

  if (error) return error.message

  revalidatePath("/settings")
  return null
}
