import { describe, it, expect } from "vitest"
import { groupInvoicesByMonth } from "./invoices"
import { Invoice } from "./types/invoice"

function makeInvoice(created_at: string, id = "INV-1"): Invoice {
  return {
    id,
    created_at,
    date: "2026-01-01",
    status: "unpaid",
    notes: "",
    lines: [],
    company: null,
    client: null,
  }
}

describe("groupInvoicesByMonth", () => {
  it("returns empty array for empty input", () => {
    expect(groupInvoicesByMonth([])).toEqual([])
  })

  it("groups invoices from the same month together", () => {
    const invoices = [
      makeInvoice("2026-03-01T00:00:00Z", "INV-1"),
      makeInvoice("2026-03-15T12:00:00Z", "INV-2"),
    ]
    const result = groupInvoicesByMonth(invoices)
    expect(result).toHaveLength(1)
    expect(result[0].month).toBe("2026-03")
    expect(result[0].items).toHaveLength(2)
  })

  it("splits invoices from different months into separate groups", () => {
    const invoices = [
      makeInvoice("2026-01-05T00:00:00Z", "INV-1"),
      makeInvoice("2026-02-10T00:00:00Z", "INV-2"),
      makeInvoice("2026-03-20T00:00:00Z", "INV-3"),
    ]
    const result = groupInvoicesByMonth(invoices)
    expect(result).toHaveLength(3)
  })

  it("sorts groups newest-first", () => {
    const invoices = [
      makeInvoice("2026-01-01T00:00:00Z", "INV-1"),
      makeInvoice("2026-03-01T00:00:00Z", "INV-3"),
      makeInvoice("2026-02-01T00:00:00Z", "INV-2"),
    ]
    const result = groupInvoicesByMonth(invoices)
    expect(result[0].month).toBe("2026-03")
    expect(result[1].month).toBe("2026-02")
    expect(result[2].month).toBe("2026-01")
  })

  it("preserves all invoices within a group", () => {
    const invoices = [
      makeInvoice("2026-06-01T00:00:00Z", "INV-A"),
      makeInvoice("2026-06-15T00:00:00Z", "INV-B"),
      makeInvoice("2026-06-30T00:00:00Z", "INV-C"),
    ]
    const result = groupInvoicesByMonth(invoices)
    expect(result[0].items.map((i) => i.id)).toEqual(["INV-A", "INV-B", "INV-C"])
  })

  it("uses YYYY-MM format for month keys", () => {
    const invoices = [makeInvoice("2026-09-05T00:00:00Z", "INV-1")]
    const result = groupInvoicesByMonth(invoices)
    expect(result[0].month).toMatch(/^\d{4}-\d{2}$/)
  })

  it("zero-pads single-digit months", () => {
    const invoices = [makeInvoice("2026-03-01T00:00:00Z", "INV-1")]
    const result = groupInvoicesByMonth(invoices)
    expect(result[0].month).toBe("2026-03")
  })

  it("handles a single invoice", () => {
    const invoices = [makeInvoice("2025-11-20T00:00:00Z", "INV-1")]
    const result = groupInvoicesByMonth(invoices)
    expect(result).toHaveLength(1)
    expect(result[0].items[0].id).toBe("INV-1")
  })
})
