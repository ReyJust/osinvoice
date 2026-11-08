"use client"

import { useActionState } from "react"
import { saveEmailTemplate } from "@/app/settings/actions"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { EMAIL_TEMPLATE_LABELS, EmailTemplates } from "@/lib/email-template"

export function EmailTemplateForm({ templates }: { templates: EmailTemplates }) {
  const [error, action, pending] = useActionState(saveEmailTemplate, null)

  return (
    <form action={action} className="flex flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="template_contact">
          {EMAIL_TEMPLATE_LABELS.contact}
        </FieldLabel>
        <Textarea
          id="template_contact"
          name="template_contact"
          defaultValue={templates.contact}
          className="min-h-64 font-mono text-xs"
          spellCheck={false}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="template_generic">
          {EMAIL_TEMPLATE_LABELS.generic}
        </FieldLabel>
        <Textarea
          id="template_generic"
          name="template_generic"
          defaultValue={templates.generic}
          className="min-h-64 font-mono text-xs"
          spellCheck={false}
        />
      </Field>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending && <Spinner />}
          Save Templates
        </Button>
      </div>
    </form>
  )
}
