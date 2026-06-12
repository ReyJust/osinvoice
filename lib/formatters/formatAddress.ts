interface AddressParts {
  address?: string
  city?: string
  state?: string
  postcode?: string
  country?: string
}

export function formatAddress(
  addressParts: Partial<AddressParts>,
  includeCountry = false
): string {
  const parts = [
    addressParts.address,
    addressParts.city,
    addressParts.state,
    addressParts.postcode,
  ]

  if (includeCountry) {
    parts.push(addressParts.country)
  }

  return parts.filter(Boolean).join(", ")
}
