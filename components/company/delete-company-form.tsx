"use client"

import { Company } from "@/lib/types/company"

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

export function DeleteCompanyForm({ company }: { company: Company }) {
  const [open, setOpen] = useState(false)

  const onDeleteCompany = () => {
    console.log("TO DELETE")

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <form id="delete-company-form" onSubmit={onDeleteCompany}>
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
              Are you sure you want to delete {company.name}?
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
