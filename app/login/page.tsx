import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = { title: "Login" }

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect("/invoice")

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
