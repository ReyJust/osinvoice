import { describe, it, expect } from "vitest"
import { formatAddress } from "./formatAddress"

describe("formatAddress", () => {
  it("joins all parts with commas", () => {
    expect(
      formatAddress({
        address: "123 Main St",
        city: "Melbourne",
        state: "VIC",
        postcode: "3000",
      })
    ).toBe("123 Main St, Melbourne, VIC, 3000")
  })

  it("excludes country by default", () => {
    const result = formatAddress({
      address: "1 Queen St",
      city: "Sydney",
      state: "NSW",
      postcode: "2000",
      country: "Australia",
    })
    expect(result).not.toContain("Australia")
  })

  it("includes country when includeCountry is true", () => {
    const result = formatAddress(
      {
        address: "1 Queen St",
        city: "Sydney",
        state: "NSW",
        postcode: "2000",
        country: "Australia",
      },
      true
    )
    expect(result).toBe("1 Queen St, Sydney, NSW, 2000, Australia")
  })

  it("filters out undefined parts", () => {
    expect(
      formatAddress({
        address: "45 Park Ave",
        city: "Brisbane",
      })
    ).toBe("45 Park Ave, Brisbane")
  })

  it("filters out empty-string parts", () => {
    expect(
      formatAddress({
        address: "",
        city: "Perth",
        state: "WA",
        postcode: "",
      })
    ).toBe("Perth, WA")
  })

  it("returns empty string for an empty object", () => {
    expect(formatAddress({})).toBe("")
  })

  it("handles only postcode being provided", () => {
    expect(formatAddress({ postcode: "4000" })).toBe("4000")
  })
})
