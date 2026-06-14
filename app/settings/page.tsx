import type { Metadata } from "next"
import { createClient } from "@/utils/supabase/server"
import { getUserSettings } from "@/lib/user-settings"
import { DEFAULT_EMAIL_TEMPLATE } from "@/lib/email-template"
import { ProfileForm } from "@/components/settings/profile-form"
import { EmailTemplateForm } from "@/components/settings/email-template-form"

export const metadata: Metadata = { title: "Settings" }

const MERGE_TAGS = [
  { tag: "{clientName}", description: "Client's name" },
  { tag: "{invoiceId}", description: "Invoice number" },
  { tag: "{amount}", description: "Total amount" },
  { tag: "{companyName}", description: "Your company name" },
  { tag: "{date}", description: "Invoice date" },
  { tag: "{paymentDetails}", description: "BSB & account number block (omitted if not set)" },
]

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let settings = null
  try {
    settings = await getUserSettings()
  } catch {
    // unauthenticated — middleware should prevent this, but degrade gracefully
  }

  const currentTemplate = settings?.email_body_template ?? DEFAULT_EMAIL_TEMPLATE
  const name = user?.user_metadata?.name ?? ""
  const surname = user?.user_metadata?.surname ?? ""

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-2xl">
      <div>
        <h1 className="text-lg font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your name as it appears on invoices and emails.
        </p>
      </div>

      <ProfileForm name={name} surname={surname} />

      <hr className="border-border" />

      <div>
        <h1 className="text-lg font-semibold">Email Template</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customise the body of invoice emails. Use merge tags to insert invoice
          data automatically.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {MERGE_TAGS.map(({ tag, description }) => (
          <span
            key={tag}
            className="inline-flex flex-col rounded-md border bg-muted px-3 py-1.5 text-xs"
            title={description}
          >
            <span className="font-mono font-semibold">{tag}</span>
            <span className="text-muted-foreground">{description}</span>
          </span>
        ))}
      </div>

      <EmailTemplateForm currentTemplate={currentTemplate} />
    </div>
  )
}
