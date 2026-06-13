"use client"

import { Client } from "@/lib/types/client"

import { Button } from "@/components/ui/button"

import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { deleteClient } from "@/app/client/actions"

export function DeleteClientForm({ client }: { client: Client }) {
  const [open, setOpen] = useState(false)

  const onDeleteClient = async () => {
    await deleteClient(client.id)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <form id="delete-client-form" onSubmit={onDeleteClient}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="icon">
            <HugeiconsIcon
              icon={Delete02Icon}
              // className="text-muted-foreground"
              // size={24}
              // color="#FFFFFF"
              // strokeWidth={1.5}
            />
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {client.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button className="flex-1" variant="default">
                Cancel
              </Button>
            </DialogClose>

            <Button className="flex-1" type="submit" variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
