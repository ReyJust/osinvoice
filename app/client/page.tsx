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

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

// import { Kbd } from "@/components/ui/kbd"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  UserDollarIcon,
} from "@hugeicons/core-free-icons"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

import { Client } from "@/lib/types/client"
import { ClientCard } from "@/components/client/client-card"
import { CreateClientForm } from "@/components/client/create-client-form"

const clients: Client[] = [
  {
    id: 1,
    address: "1 Main Street",
    city: "Sydney",
    state: "NSW",
    postcode: "2000",
    country: "AU",

    email: "info@conquest.com",
    name: "Conquest",
    created_at: new Date(),
  },
  {
    id: 2,
    address: "2 Main Street",
    city: "Sydney",
    state: "NSW",
    postcode: "2000",
    country: "AU",
    email: "info@plantingoz.com",
    name: "PlantingOz",
    created_at: new Date(),
  },
  {
    id: 3,
    address: "1 Main Street",
    city: "Sydney",
    state: "NSW",
    postcode: "2000",
    country: "AU",

    email: "info@ozbacs.com",
    name: "OzBacs",
    created_at: new Date(),
  },
  {
    id: 4,
    address: "1 Main Street",
    city: "Sydney",
    state: "NSW",
    postcode: "2000",
    country: "AU",

    email: "info@mainlabour.com",
    name: "Main Labour",
    created_at: new Date(),
  },
]

// clients.length = 0

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // const { data: todos } = await supabase.from('todos').select()
  // console.log('todos', todos)

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
            <Button>Create new client</Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <Field className="max-w-1/2 bg-white">
              <ButtonGroup>
                <Input
                  id="input-button-group"
                  placeholder="Type to search..."
                />
                <Button variant="default" size="icon">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    // size={24}
                    // color="#FFFFFF"
                    // strokeWidth={1.5}
                  />
                </Button>
              </ButtonGroup>
            </Field>
            <CreateClientForm />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {clients.map((client) => {
                return <ClientCard key={client.id} client={client} />
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
