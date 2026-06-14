import { describe, it, expect } from "vitest"
import { formatDate } from "./formatDate"

describe("formatDate", () => {
  it("formats a date string in DD/MM/YYYY format", () => {
    expect(formatDate("2026-06-13")).toBe("13/06/2026")
  })

  it("formats a Date object", () => {
    expect(formatDate(new Date("2024-01-15"))).toBe("15/01/2024")
  })

  it("formats a numeric timestamp", () => {
    // 2023-03-01T00:00:00.000Z in UTC (local TZ may shift but format stays correct)
    const ts = new Date("2023-03-01").getTime()
    expect(formatDate(ts)).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
  })

  it("zero-pads single-digit day and month", () => {
    expect(formatDate("2025-01-05")).toBe("05/01/2025")
  })

  it("handles leap-year date (Feb 29)", () => {
    expect(formatDate("2024-02-29")).toBe("29/02/2024")
  })

  it("handles end-of-year date (Dec 31)", () => {
    expect(formatDate("2023-12-31")).toBe("31/12/2023")
  })

  it("handles start-of-year date (Jan 1)", () => {
    expect(formatDate("2024-01-01")).toBe("01/01/2024")
  })
})
