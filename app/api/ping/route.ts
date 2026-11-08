import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "@/lib/types/database.types"

export const dynamic = "force-dynamic"

// Keep-alive for Supabase free tier (projects pause after 7 days of inactivity).
// Triggered daily by Vercel Cron (see vercel.json).
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } }
  )

  // Real query hitting Postgres. RLS returns no rows for anon, which is fine.
  const { error } = await supabase
    .from("companies")
    .select("id", { head: true, count: "exact" })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() })
}
