// import { IconFolderCode } from "@tabler/icons-react"
// import { ArrowUpRightIcon } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

// import { Kbd } from "@/components/ui/kbd"

import { HugeiconsIcon } from "@hugeicons/react"
import { UserDollarIcon } from "@hugeicons/core-free-icons"

import { ClientCard } from "@/components/client/client-card"
import { CreateClientForm } from "@/components/client/create-client-form"
import { getClients } from "@/lib/clients"
import { SearchSection } from "@/components/search-section"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams

  const clients = await getClients(search)

  return (
    <div className="">
      <h1 className="pb-4 text-2xl font-bold">Clients</h1>

      {clients.length == 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon
                icon={UserDollarIcon}
                // className="text-muted-foreground"
                // size={24}
                // color="#FFFFFF"
                // strokeWidth={1.5}
              />
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
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <SearchSection />
            <CreateClientForm />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {clients.map((client) => {
                // return <p>{client.name}</p>
                return <ClientCard key={client.id} client={client} />
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
