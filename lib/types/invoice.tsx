// import { z } from "zod"

import { Client } from "./client"
import { Company } from "./company"

// /**
//  * 1. INPUT (forms / API payload)
//  * Only editable fields
//  */
// export const InvoiceInputSchema = z.object({
//   company_id: z.number(),
//   client_id: z.number(),
//   description: z.string(),
//   lines: z.array(
//     z.object({
//       description: z.string().max(100),
//       quantity: z.number(),
//       type: z.enum(["service", "product"]),
//     })
//   ),
//   //   timesheet_url: z.string(),
//   notes: z.string().max(256),
//   status: z.enum(["draft", "unpaid", "paid", "overdue"]),
// })

// export type InvoiceInput = z.infer<typeof InvoiceInputSchema>

export type InvoiceLine = {
  id: string
  date: string
  description: string
  quantity: number
  unitPrice: number
  totalAmount: number
}

export type InvoiceInput = {
  id: string
  company: Company|null
  client: Client|null
  status: "unpaid" | "paid"
  date: string
  lines: InvoiceLine[]
  notes?: string
}

/**
 * 2. DOMAIN MODEL (DB / API response)
 * Fully hydrated entity
 */
export type Invoice = {
  id: string
  created_at: string
} & InvoiceInput
