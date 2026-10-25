// Local name of the company registration / tax number printed on invoices,
// keyed by ISO 3166-1 alpha-2 country code.
const REGISTRATION_LABELS: Record<string, string> = {
  AE: "TRN",
  AU: "ABN",
  BR: "CNPJ",
  CA: "BN",
  CH: "UID",
  ES: "NIF",
  FR: "SIRET",
  GB: "Company No.",
  HK: "BRN",
  IE: "CRO No.",
  IN: "GSTIN",
  IT: "P.IVA",
  MU: "BRN",
  MX: "RFC",
  NL: "KvK",
  NZ: "NZBN",
  PT: "NIF",
  SG: "UEN",
  US: "EIN",
}

export const DEFAULT_REGISTRATION_LABEL = "Company No."

export function formatRegistrationLabel(country?: string | null): string {
  if (!country) return DEFAULT_REGISTRATION_LABEL
  return REGISTRATION_LABELS[country.toUpperCase()] ?? DEFAULT_REGISTRATION_LABEL
}
