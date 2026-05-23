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
import { Company, CompanyInput, CompanyInputSchema } from "@/lib/types/company"
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

export function CompanyForm({
  company,
  submit,
}: {
  company?: Partial<Company>
  submit: SubmitHandler<CompanyInput>
}) {
  const form = useForm<z.infer<typeof CompanyInputSchema>>({
    resolver: zodResolver(CompanyInputSchema),
    defaultValues: {
      ...company,
    },
  })
  const countries = getCountryList()
  useEffect(() => {
    form.reset(company)
  }, [company])

  return (
    <form id="update-company-form" onSubmit={form.handleSubmit(submit)}>
      <FieldGroup>
        <div className="grid gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="company-form-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="company-form-name"
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
                <FieldLabel htmlFor="company-form-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="company-form-email"
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
                <FieldLabel htmlFor="company-form-country">Country</FieldLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="company-form-country"
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
            name="bsb"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="company-form-bsb">BSB</FieldLabel>
                <Input
                  {...field}
                  id="company-form-bsb"
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
            name="account_number"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="company-form-account_number">
                  Account Number
                </FieldLabel>
                <Input
                  {...field}
                  id="company-form-account_number"
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
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="company-form-address">Address</FieldLabel>
                <Input
                  {...field}
                  id="company-form-address"
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
                <FieldLabel htmlFor="company-form-city">City</FieldLabel>
                <Input
                  {...field}
                  id="company-form-city"
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
                <FieldLabel htmlFor="company-form-state">State</FieldLabel>
                <Input
                  {...field}
                  id="company-form-state"
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
                <FieldLabel htmlFor="company-form-postcode">
                  Postcode
                </FieldLabel>
                <Input
                  {...field}
                  id="company-form-postcode"
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
        <Button type="submit" form="update-company-form">
          Save changes
        </Button>
      </DialogFooter>
    </form>
  )
}
