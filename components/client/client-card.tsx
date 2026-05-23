import { Client } from "@/lib/types/client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UpdateClientForm } from "@/components/client/update-client-form"

import { DeleteClientForm } from "./delete-client-form"
import { formatAddress, formatDate } from "@/lib/formatters"

export function ClientCard({ client }: { client: Client }) {
  return (
    <Card id={"client-" + client.id.toString()}>
      <CardHeader>
        <CardTitle>{client.name}</CardTitle>
        <CardDescription>{client.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{formatAddress(client)}</p>
        <p className="text-xs text-gray-400">
          Created on: {formatDate(client.created_at)}
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <UpdateClientForm client={client} />
        <DeleteClientForm client={client} />
      </CardFooter>
    </Card>
  )
}
