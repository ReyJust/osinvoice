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
  const generic = formData.get("template_generic") as string
  const contact = formData.get("template_contact") as string
  const supabase = await createClient()
  const user = await requireUser()

  const { error } = await supabase.from("user_settings").upsert(
    {
      user_id: user.id,
      email_body_template: generic,
      email_body_template_contact: contact,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  if (error) return error.message

  revalidatePath("/settings")
  return null
}
