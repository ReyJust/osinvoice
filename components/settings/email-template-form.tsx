"use client"

import { useActionState } from "react"
import { saveEmailTemplate } from "@/app/settings/actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function EmailTemplateForm({ currentTemplate }: { currentTemplate: string }) {
  const [error, action, pending] = useActionState(saveEmailTemplate, null)

  return (
    <form action={action} className="flex flex-col gap-4">
      <Textarea
        name="template"
        defaultValue={currentTemplate}
        className="min-h-64 font-mono text-xs"
        spellCheck={false}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending && (
            <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          Save Template
        </Button>
      </div>
    </form>
  )
}
