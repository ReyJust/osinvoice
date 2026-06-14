"use client"

import { useActionState } from "react"
import { updateProfile } from "@/app/settings/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

export function ProfileForm({ name, surname }: { name: string; surname: string }) {
  const [error, action, pending] = useActionState(updateProfile, null)

  return (
    <form action={action}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="name">First name</FieldLabel>
            <Input id="name" name="name" defaultValue={name} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="surname">Last name</FieldLabel>
            <Input id="surname" name="surname" defaultValue={surname} required />
          </Field>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending && (
              <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            Save Profile
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
