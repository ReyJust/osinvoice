"use client"

import { Input } from "@/components/ui/input"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Edit03Icon } from "@hugeicons/core-free-icons"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { getCountryList } from "@/lib/countries"
import { useEffect, useState } from "react"
import { Client, ClientInput, ClientInputSchema } from "@/lib/types/client"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"

export function ClientForm({
  client,
  submit,
}: {
  client?: Partial<Client>
  submit: SubmitHandler<ClientInput>
}) {
  const form = useForm<z.infer<typeof ClientInputSchema>>({
    resolver: zodResolver(ClientInputSchema),
    defaultValues: {
      ...client,
    },
  })
  const countries = getCountryList()
  useEffect(() => {
    form.reset(client)
  }, [client])

  return (
    <form id="update-client-form" onSubmit={form.handleSubmit(submit)}>
      <FieldGroup>
        <div className="grid gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="client-form-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="client-form-name"
                  aria-invalid={fieldState.invalid}
                  // placeholder=""
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="client-form-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="client-form-email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  // placeholder=""
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="country"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="client-form-country">Country</FieldLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="client-form-country"
                    aria-invalid={fieldState.invalid}
                    // className="min-w-[120px]"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => {
                      return (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="client-form-address">Address</FieldLabel>
                <Input
                  {...field}
                  id="client-form-address"
                  aria-invalid={fieldState.invalid}
                  // placeholder=""
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="city"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="client-form-city">City</FieldLabel>
                <Input
                  {...field}
                  id="client-form-city"
                  aria-invalid={fieldState.invalid}
                  // placeholder=""
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="state"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="client-form-state">State</FieldLabel>
                <Input
                  {...field}
                  id="client-form-state"
                  aria-invalid={fieldState.invalid}
                  // placeholder=""
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="postcode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="client-form-postcode">Postcode</FieldLabel>
                <Input
                  {...field}
                  id="client-form-postcode"
                  aria-invalid={fieldState.invalid}
                  // placeholder=""
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" form="update-client-form">
          Save changes
        </Button>
      </DialogFooter>
    </form>
  )
}
