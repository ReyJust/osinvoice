"use client"

import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { useState } from "react"
import { CompanyInput } from "@/lib/types/company"
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

import { CompanyForm } from "./company-form"

export function CreateCompanyForm() {
  const [open, setOpen] = useState(false)

  const onCreateCompany = (data: CompanyInput) => {
    console.log(data)

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          New Company
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
          <DialogTitle>Create New Company</DialogTitle>
          <DialogDescription>
            Create your new company here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <CompanyForm submit={onCreateCompany} />
      </DialogContent>
    </Dialog>
  )
}
