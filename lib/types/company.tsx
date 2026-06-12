import { z } from "zod"

import { getAlpha2Codes } from "i18n-iso-countries"
const countryCodes = Object.keys(getAlpha2Codes()) as [string, ...string[]]

/**
 * 1. INPUT (forms / API payload)
 * Only editable fields
 */
export const CompanyInputSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Required")
    .min(2, "Too short")
    .max(100, "Too long"),
  // logo: z.string().trim().max(256, "Too long"),
  email: z
    .string()
    .trim()
    .nonempty("Required")
    .email("Invalid Email")
    .max(254)
    .toLowerCase(),
  address: z.string().trim().nonempty("Required").max(200),
  city: z.string().trim().nonempty("Required").max(100),
  state: z.string().trim().nonempty("Required").max(100),
  postcode: z.string().trim().nonempty("Required").max(12, "Invalid postcode"),
  country: z.enum(countryCodes),
  bsb: z.string(),
  account_number: z.string(),
})

export type CompanyInput = z.infer<typeof CompanyInputSchema>

/**
 * 2. DOMAIN MODEL (DB / API response)
 * Fully hydrated entity
 */
export type Company = {
  id: number
  created_at: string
} & CompanyInput
