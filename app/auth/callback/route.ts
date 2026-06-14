import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as "email" | "magiclink" | "recovery" | null

  const supabase = await createClient()

  // PKCE flow — OAuth / magic link via browser client
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}/invoice/new`)
    console.error("exchangeCodeForSession error:", error)
    return NextResponse.redirect(`${origin}/login`)
  }

  // Token hash flow — admin-generated magic links (e.g. E2E test setup)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (!error) return NextResponse.redirect(`${origin}/invoice/new`)
    console.error("verifyOtp error:", error)
    return NextResponse.redirect(`${origin}/login`)
  }

  return NextResponse.redirect(`${origin}/login`)
}
