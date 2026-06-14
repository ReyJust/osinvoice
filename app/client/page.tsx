import type { Metadata } from "next"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserDollarIcon } from "@hugeicons/core-free-icons"
export const metadata: Metadata = { title: "Clients" }

import { CreateClientForm } from "@/components/client/create-client-form"
import { getClients } from "@/lib/clients"
import { DataTable } from "@/components/ui/data-table"
import { clientColumns } from "@/components/client/client-columns"

export default async function Page() {
  const clients = await getClients()

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-bold">Clients</h1>
        <CreateClientForm />
      </div>

      {clients.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={UserDollarIcon} />
            </EmptyMedia>
            <EmptyTitle>No Clients Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any clients yet. Get started by creating
              your first client.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <CreateClientForm />
          </EmptyContent>
        </Empty>
      ) : (
        <DataTable
          columns={clientColumns}
          data={clients}
          searchPlaceholder="Search by name, email or location…"
          defaultSort={[{ id: "name", desc: false }]}
        />
      )}
    </div>
  )
}
