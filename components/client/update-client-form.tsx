"use client"

import { Edit03Icon } from "@hugeicons/core-free-icons"

import {  useState } from "react"
import { Client, ClientInput } from "@/lib/types/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { HugeiconsIcon } from "@hugeicons/react"

import { ClientForm } from "./client-form"
import { updateClient } from "@/app/client/actions"

export function UpdateClientForm({ client }: { client: Client }) {
  const [open, setOpen] = useState(false)

  const onUpdateClient = async (data: ClientInput) => {
    await updateClient(client.id, data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="icon">
          <HugeiconsIcon
            icon={Edit03Icon}
            // className="text-muted-foreground"
            // size={24}
            // color="#FFFFFF"
            // strokeWidth={1.5}
          />
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>
            Make changes to your client here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <ClientForm client={client} submit={onUpdateClient}/>
      </DialogContent>
    </Dialog>
  )
}
