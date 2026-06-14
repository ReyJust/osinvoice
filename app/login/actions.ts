"use server"

import { headers } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function signInOrUpWithEmail(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = formData.get("email") as string
  const name = formData.get("name") as string
  const surname = formData.get("surname") as string

  const supabase = await createClient()

  const h = await headers()
  const host = h.get("host") ?? "localhost:3000"
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https")
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: { name, surname },
      shouldCreateUser: true,
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) return error.message

  redirect("/check-email")
}
