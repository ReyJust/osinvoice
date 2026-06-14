import { getUserSettings } from "@/lib/user-settings"
import { saveEmailTemplate } from "@/app/settings/actions"
import { DEFAULT_EMAIL_TEMPLATE } from "@/lib/email-template"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const MERGE_TAGS = [
  { tag: "{clientName}", description: "Client's name" },
  { tag: "{invoiceId}", description: "Invoice number" },
  { tag: "{amount}", description: "Total amount" },
  { tag: "{companyName}", description: "Your company name" },
  { tag: "{date}", description: "Invoice date" },
  { tag: "{paymentDetails}", description: "BSB & account number block (omitted if not set)" },
]

export default async function SettingsPage() {
  let settings = null
  try {
    settings = await getUserSettings()
  } catch {
    // unauthenticated — middleware should prevent this, but degrade gracefully
  }

  const currentTemplate = settings?.email_body_template ?? DEFAULT_EMAIL_TEMPLATE

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-2xl">
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

      <form action={saveEmailTemplate} className="flex flex-col gap-4">
        <Textarea
          name="template"
          defaultValue={currentTemplate}
          className="min-h-64 font-mono text-xs"
          spellCheck={false}
        />
        <div className="flex justify-end">
          <Button type="submit">Save Template</Button>
        </div>
      </form>
    </div>
  )
}
