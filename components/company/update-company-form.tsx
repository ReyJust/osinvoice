"use client"

import { Edit03Icon } from "@hugeicons/core-free-icons"

import {  useState } from "react"
import { Company, CompanyInput } from "@/lib/types/company"
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
import { updateCompany } from "@/app/company/actions"

export function UpdateCompanyForm({ company }: { company: Company }) {
  const [open, setOpen] = useState(false)

  const onUpdateCompany = async (data: CompanyInput) => {
    await updateCompany(company.id, data)
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
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>
            Make changes to your company here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <CompanyForm company={company} submit={onUpdateCompany}/>
      </DialogContent>
    </Dialog>
  )
}
