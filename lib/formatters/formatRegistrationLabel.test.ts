import { describe, expect, it } from "vitest"
import {
  DEFAULT_REGISTRATION_LABEL,
  formatRegistrationLabel,
} from "./formatRegistrationLabel"

describe("formatRegistrationLabel", () => {
  it("returns the local label for known countries", () => {
    expect(formatRegistrationLabel("AU")).toBe("ABN")
    expect(formatRegistrationLabel("MU")).toBe("BRN")
    expect(formatRegistrationLabel("FR")).toBe("SIRET")
  })

  it("is case-insensitive", () => {
    expect(formatRegistrationLabel("au")).toBe("ABN")
  })

  it("falls back to the default label for unknown or missing countries", () => {
    expect(formatRegistrationLabel("ZZ")).toBe(DEFAULT_REGISTRATION_LABEL)
    expect(formatRegistrationLabel("")).toBe(DEFAULT_REGISTRATION_LABEL)
    expect(formatRegistrationLabel(undefined)).toBe(DEFAULT_REGISTRATION_LABEL)
    expect(formatRegistrationLabel(null)).toBe(DEFAULT_REGISTRATION_LABEL)
  })
})
