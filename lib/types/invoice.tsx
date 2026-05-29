import { z } from "zod"

/**
 * 1. INPUT (forms / API payload)
 * Only editable fields
 */
export const InvoiceInputSchema = z.object({
  company_id: z.number(),
  client_id: z.number(),
  description: z.string(),
  lines: z.array(
    z.object({
      description: z.string().max(100),
      quantity: z.number(),
      type: z.enum(["service", "product"]),
    })
  ),
  //   timesheet_url: z.string(),
  notes: z.string().max(256),
  status: z.enum(["draft", "unpaid", "paid", "overdue"]),
})

export type InvoiceInput = z.infer<typeof InvoiceInputSchema>

/**
 * 2. DOMAIN MODEL (DB / API response)
 * Fully hydrated entity
 */
export type Invoice = {
  id: string
  created_at: Date
} & InvoiceInput
