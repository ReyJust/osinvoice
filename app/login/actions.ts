"use server"

import { headers } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

async function getOrigin() {
  const h = await headers()
  const host = h.get("host") ?? "localhost:3000"
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https")
  return process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`
}

// Sends the magic link sign-in email.
async function sendSignInEmail(
  email: string,
  data?: { name: string; surname: string }
) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data,
      shouldCreateUser: true,
      emailRedirectTo: `${await getOrigin()}/auth/callback`,
    },
  })
  return error?.message ?? null
}

export async function signInOrUpWithEmail(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = (formData.get("email") as string).trim()
  const name = formData.get("name") as string | null
  const surname = formData.get("surname") as string | null

  const error = await sendSignInEmail(
    email,
    name && surname ? { name, surname } : undefined
  )
  if (error) return error

  redirect(`/check-email?email=${encodeURIComponent(email)}`)
}

export async function resendSignInEmail(email: string): Promise<string | null> {
  if (!email) return "Missing email address."
  return sendSignInEmail(email)
}
