import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { SignupForm } from "@/components/signup-form"

export const metadata: Metadata = { title: "Sign Up" }

export default async function SignupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect("/invoice")

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}
