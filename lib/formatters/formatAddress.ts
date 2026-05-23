import { Client } from "../types/client"

export function formatAddress(client: Client) {
  const parts = [
    client.address,
    client.city,
    client.state,
    client.postcode,
    client.country,
  ].filter(Boolean)

  return parts.join(", ")
}