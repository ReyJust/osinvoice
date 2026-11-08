import type { Metadata } from "next"
import { CheckEmailForm } from "@/components/check-email-form"

export const metadata: Metadata = { title: "Check Your Email" }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <CheckEmailForm email={email ?? ""} />
    </div>
  )
}
