import { Client } from "../types/client"

export function formatAddress(client: Client, includeCountry = false): string {
  const parts = [client.address, client.city, client.state, client.postcode]

  if (includeCountry) {
    parts.push(client.country)
  }

  return parts.filter(Boolean).join(", ")
}
