"use client"

import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { useState } from "react"
import { ClientInput } from "@/lib/types/client"
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

export function CreateClientForm() {
  const [open, setOpen] = useState(false)

  const onCreateClient = (data: ClientInput) => {
    console.log(data)

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          New Client
          <HugeiconsIcon
            icon={PlusSignIcon}
            // size={24}
            // color="currentColor"
            // strokeWidth={1.5}
          />
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Client</DialogTitle>
          <DialogDescription>
            Create your new client here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <ClientForm submit={onCreateClient} />
      </DialogContent>
    </Dialog>
  )
}
