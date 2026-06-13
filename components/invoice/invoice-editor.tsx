"use client"

import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Invoice, InvoiceInput, InvoiceLine } from "@/lib/types/invoice"
import { Company } from "@/lib/types/company"
import { Client, ClientInput } from "@/lib/types/client"
import { Separator } from "@/components/ui/separator"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

import { Field } from "../ui/field"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown,
  ArrowUp,
  Copy01Icon,
  Delete01Icon,
  PencilEdit02Icon,
  PlusSignIcon,
  SaveIcon,
} from "@hugeicons/core-free-icons"
import React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "../ui/calendar"
import { formatAddress } from "@/lib/formatters"

import { useSupabase } from "@/utils/supabase/client"

import { CompanyInput } from "@/lib/types/company"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ClientForm } from "@/components/client/client-form"
import { createClient } from "@/app/client/actions"
import { CompanyForm } from "@/components/company/company-form"
import { createCompany } from "@/app/company/actions"
import { createInvoice, updateInvoice } from "@/app/invoice/actions"
import { Invoice } from "@/lib/types/invoice"

export default function InvoiceEditor({
  clients,
  companies,
  initialInvoice,
}: {
  clients: { value: Client; label: string }[]
  companies: { value: Company; label: string }[]
  initialInvoice?: Invoice
}) {
  const supabase = useSupabase()

  const [draft, setDraft] = useState<InvoiceInput>(() =>
    initialInvoice
      ? {
          ...initialInvoice,
          date: new Date(initialInvoice.date) as any,
        }
      : {
          id: generateInvoiceId(),
          date: new Date() as any,
          company: null,
          client: null,
          status: "unpaid" as const,
          lines: [],
        }
  )

  const invoiceTotal = useMemo(() => {
    return draft.lines.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0
    )
  }, [draft.lines])

  function generateInvoiceId(prefix = "INV") {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")

    const random = cryptoRandomBase36(6)

    return `${prefix}-${date}-${random}`
  }

  function cryptoRandomBase36(length: number) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const bytes = new Uint8Array(length)
    crypto.getRandomValues(bytes)

    return Array.from(bytes, (b) => chars[b % chars.length]).join("")
  }

  const setCurrentCompany = (company: Company) => {
    setDraft((prev) => ({ ...prev, company }))
  }
  const setCurrentClient = (client: Client) => {
    setDraft((prev) => ({ ...prev, client }))
  }

  const addInvoiceLine = (invoiceId: string) => {
    const lastLine = draft.lines[draft.lines.length - 1]
    const baseDate = lastLine
      ? new Date(lastLine.date + "T00:00:00") // parse as local midnight to avoid UTC offset shift
      : new Date(draft.date)
    baseDate.setDate(baseDate.getDate() + 1)
    const pad = (n: number) => String(n).padStart(2, "0")
    const nextDate = `${baseDate.getFullYear()}-${pad(baseDate.getMonth() + 1)}-${pad(baseDate.getDate())}`

    const newLine: InvoiceLine = {
      id: `${invoiceId}-${cryptoRandomBase36(6)}`,
      date: nextDate,
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
    }
    setDraft((prev) => ({ ...prev, lines: [...prev.lines, newLine] }))
  }
  const removeInvoiceLine = (lineId: string) => {
    setDraft((prev) => ({
      ...prev,
      lines: prev.lines.filter((line) => line.id !== lineId),
    }))
  }

  const duplicateInvoiceLine = (lineId: string) => {
    const lineToDuplicate = draft.lines.find((line) => line.id === lineId)
    if (lineToDuplicate) {
      const newLine = { ...lineToDuplicate, id: crypto.randomUUID() }
      setDraft((prev) => ({ ...prev, lines: [...prev.lines, newLine] }))
    }
  }

  const handleLineDescriptionChange = (lineId: string, description: string) => {
    setDraft((prev) => ({
      ...prev,
      lines: prev.lines.map((line) =>
        line.id === lineId ? { ...line, description } : line
      ),
    }))
  }
  const handleLineUnitPriceChange = (lineId: string, unitPrice: string) => {
    const parsedUnitPrice = parseFloat(unitPrice) || 0

    setDraft((prev) => ({
      ...prev,
      lines: prev.lines.map((line) =>
        line.id === lineId ? { ...line, unitPrice: parsedUnitPrice } : line
      ),
    }))

    handleLineTotalAmountChange(
      lineId,
      parsedUnitPrice *
        (draft.lines.find((line) => line.id === lineId)?.quantity || 0)
    )
  }

  const handleLineQuantityChange = (lineId: string, quantity: string) => {
    const parsedQuantity = parseFloat(quantity) || 0

    setDraft((prev) => ({
      ...prev,
      lines: prev.lines.map((line) =>
        line.id === lineId ? { ...line, quantity: parsedQuantity } : line
      ),
    }))

    handleLineTotalAmountChange(
      lineId,
      parsedQuantity *
        (draft.lines.find((line) => line.id === lineId)?.unitPrice || 0)
    )
  }

  const handleLineTotalAmountChange = (lineId: string, totalAmount: number) => {
    setDraft((prev) => ({
      ...prev,
      lines: prev.lines.map((line) =>
        line.id === lineId ? { ...line, totalAmount } : line
      ),
    }))
  }

  const handleBringUpLine = (lineId: string) => {
    setDraft((prev) => {
      const index = prev.lines.findIndex((line) => line.id === lineId)
      if (index > 0) {
        const newLines = [...prev.lines]
        const temp = newLines[index - 1]
        newLines[index - 1] = newLines[index]
        newLines[index] = temp
        return { ...prev, lines: newLines }
      }
      return prev
    })
  }

  const handleBringDownLine = (lineId: string) => {
    setDraft((prev) => {
      const index = prev.lines.findIndex((line) => line.id === lineId)
      if (index < prev.lines.length - 1) {
        const newLines = [...prev.lines]
        const temp = newLines[index + 1]
        newLines[index + 1] = newLines[index]
        newLines[index] = temp
        return { ...prev, lines: newLines }
      }
      return prev
    })
  }

  const handleLineDateChange = (lineId: string, date: string) => {
    setDraft((prev) => ({
      ...prev,
      lines: prev.lines.map((line) =>
        line.id === lineId ? { ...line, date } : line
      ),
    }))
  }

  const handleNotesChange = (notes: string) => {
    setDraft((prev) => ({ ...prev, notes }))
  }

  const handleDateChange = (date: Date) => {
    setDraft((prev) => ({ ...prev, date }))
  }

  const router = useRouter()

  const [open, setOpen] = React.useState(false)
  const [openCompanyPopover, setOpenCompanyPopover] = React.useState(false)
  const [openClientPopover, setOpenClientPopover] = React.useState(false)

  const [openCompanyCreateDialog, setOpenCompanyCreateDialog] =
    React.useState(false)
  const [openClientCreateDialog, setOpenClientCreateDialog] =
    React.useState(false)

  const saveInvoice = async (draft: InvoiceInput) => {
    if (initialInvoice) {
      await updateInvoice(initialInvoice.id, draft)
    } else {
      await createInvoice(draft)
    }
    router.push("/invoice")
  }

  const saveDraft = async (draft: InvoiceInput) => {
    await createInvoiceDraft(draft)
  }

  const onCreateCompany = async (newCompany: CompanyInput) => {
    await createCompany(newCompany)
    setOpenCompanyCreateDialog(false)
  }

  const onCreateClient = async (newClient: ClientInput) => {
    await createClient(newClient)
    setOpenClientCreateDialog(false)
  }

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <div>
        {/* HEADER */}
        <div className="mb-10 flex justify-between">
          {/* <p>{JSON.stringify(draft)}</p> */}
          {/* COMPANY */}
          <Popover
            open={openCompanyPopover}
            onOpenChange={setOpenCompanyPopover}
          >
            <PopoverTrigger asChild>
              <Card className="min-h-24 w-1/2 cursor-pointer border border-dashed border-transparent bg-transparent p-4 transition hover:border-[#005f5a] hover:bg-[#005f5a25]">
                {draft.company ? (
                  <div>
                    <p className="my-2 font-semibold">{draft.company.name}</p>
                    <p>{formatAddress(draft.company, true)}</p>
                    <p>{draft.company.country}</p>

                    <div className="mt-4 grid grid-cols-2">
                      <p className="font-semibold">BSB :</p>
                      <p>{draft.company.bsb}</p>
                      <p className="font-semibold">Account Number :</p>
                      <p>{draft.company.account_number}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-semibold">Your Company</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Click to select company
                    </div>
                  </div>
                )}
              </Card>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Combobox
                items={companies}
                itemToStringValue={(company: {
                  value: Company
                  label: string
                }) => company.label}
                onValueChange={(
                  company: {
                    value: Company
                    label: string
                  } | null
                ) => {
                  if (company) {
                    setCurrentCompany(company.value)
                  }
                  setOpenCompanyPopover(false)
                }}
              >
                <ComboboxInput
                  placeholder="Select a company"
                  showClear
                  value={draft.company?.name || ""}
                />
                <ComboboxContent>
                  <ComboboxEmpty>No companies found.</ComboboxEmpty>
                  <ComboboxList>
                    {(company: { value: Company; label: string }) => (
                      <ComboboxItem key={company.value.id} value={company}>
                        {company.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                  <Separator className="my-2" />
                  <Dialog
                    open={openCompanyCreateDialog}
                    onOpenChange={setOpenCompanyCreateDialog}
                  >
                    <DialogTrigger asChild>
                      <div className="m-2">
                        <Button className="w-full">
                          New Company
                          <HugeiconsIcon icon={PlusSignIcon} />
                        </Button>
                      </div>
                    </DialogTrigger>
                    <DialogContent
                      showCloseButton={false}
                      className="sm:max-w-4xl"
                    >
                      <DialogHeader>
                        <DialogTitle>Create New Company</DialogTitle>
                        <DialogDescription>
                          Create your new company here. Click save when
                          you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <CompanyForm submit={onCreateCompany} />
                    </DialogContent>
                  </Dialog>
                </ComboboxContent>
              </Combobox>
            </PopoverContent>
          </Popover>

          {/* INVOICE META */}
          <div className="flex w-1/2 flex-col items-end space-y-1">
            <div className="text-lg font-semibold">INVOICE</div>
            <p className="text-right">#{draft.id}</p>
            <Field className="w-[120px]">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-[120px] cursor-pointer justify-end transition hover:border hover:border-dashed hover:border-[#005f5a] hover:bg-[#005f5a25]"
                  >
                    {draft.date
                      ? draft.date.toLocaleDateString("en-GB")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="end"
                >
                  <Calendar
                    mode="single"
                    required
                    selected={draft.date}
                    captionLayout="dropdown-months"
                    onSelect={(date: Date) => {
                      handleDateChange(date)
                      setOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </div>
        </div>

        {/* CLIENT */}
        <div className="mb-10">
          <Popover open={openClientPopover} onOpenChange={setOpenClientPopover}>
            <PopoverTrigger asChild>
              <Card className="min-h-24 w-64 cursor-pointer border border-dashed border-transparent bg-transparent p-4 transition hover:border-[#005f5a] hover:bg-[#005f5a25]">
                {draft.client ? (
                  <div>
                    <p className="my-2 font-semibold">{draft.client.name}</p>
                    <p>{formatAddress(draft.client)}</p>
                    <p>{draft.client.country}</p>
                  </div>
                ) : (
                  <div>
                    <div className="font-semibold">Bill To</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Click to select client
                    </div>
                  </div>
                )}
              </Card>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Combobox
                items={clients}
                itemToStringValue={(client: { value: Client; label: string }) =>
                  client.label
                }
                onValueChange={(
                  client: {
                    value: Client
                    label: string
                  } | null
                ) => {
                  if (client) {
                    setCurrentClient(client.value)
                  }
                  setOpenClientPopover(false)
                }}
              >
                <ComboboxInput
                  placeholder="Select a client"
                  value={draft.client?.name || ""}
                />
                <ComboboxContent>
                  <ComboboxEmpty>No clients found.</ComboboxEmpty>
                  <ComboboxList>
                    {(client: { value: Client; label: string }) => (
                      <ComboboxItem key={client.value.id} value={client}>
                        {client.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                  <Separator className="my-2" />

                  <Dialog
                    open={openClientCreateDialog}
                    onOpenChange={setOpenClientCreateDialog}
                  >
                    <DialogTrigger asChild>
                      <div className="m-2">
                        <Button className="w-full">
                          New Client
                          <HugeiconsIcon icon={PlusSignIcon} />
                        </Button>
                      </div>
                    </DialogTrigger>
                    <DialogContent
                      showCloseButton={false}
                      className="sm:max-w-4xl"
                    >
                      <DialogHeader>
                        <DialogTitle>Create New Client</DialogTitle>
                        <DialogDescription>
                          Create your new client here. Click save when
                          you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>

                      <ClientForm submit={onCreateClient} />
                    </DialogContent>
                  </Dialog>
                </ComboboxContent>
              </Combobox>
            </PopoverContent>
          </Popover>
        </div>

        {/* LINES */}
        <div className="mb-10">
          <Card className="p-4">
            <div className="mb-4 font-semibold">Items</div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-sm [&_td]:py-1 [&_th]:py-1 [&_tr]:border-0">
                {draft.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="p-0!">
                      <div className="flex flex-col justify-center p-0">
                        <Button
                          variant="outline"
                          className="sm m-0 h-1/2 w-auto cursor-pointer p-0"
                          onClick={() => handleBringUpLine(line.id)}
                        >
                          <HugeiconsIcon icon={ArrowUp} size={2} />
                        </Button>
                        <Button
                          variant="outline"
                          className="sm m-0 h-1/2 w-auto cursor-pointer p-0"
                          onClick={() => handleBringDownLine(line.id)}
                        >
                          <HugeiconsIcon icon={ArrowDown} size={2} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={line.date}
                        onChange={(e) =>
                          handleLineDateChange(line.id, e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell className="w-3/4">
                      <Input
                        onChange={(e) =>
                          handleLineDescriptionChange(line.id, e.target.value)
                        }
                        value={line.description}
                      />
                    </TableCell>
                    <TableCell className="w-1/6">
                      <Input
                        type="number"
                        step="0.01"
                        onChange={(e) =>
                          handleLineUnitPriceChange(line.id, e.target.value)
                        }
                        value={line.unitPrice}
                      />
                    </TableCell>
                    <TableCell className="w-1/6">
                      <Input
                        type="number"
                        step="0.01"
                        onChange={(e) =>
                          handleLineQuantityChange(line.id, e.target.value)
                        }
                        value={line.quantity}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {line.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="p-0 text-right">
                      <Button
                        variant="default"
                        className="m-0 cursor-pointer p-2"
                        onClick={() => duplicateInvoiceLine(line.id)}
                      >
                        <HugeiconsIcon icon={Copy01Icon} />
                      </Button>
                      <Button
                        variant="destructive"
                        className="m-0 cursor-pointer p-2"
                        onClick={() => removeInvoiceLine(line.id)}
                      >
                        <HugeiconsIcon icon={Delete01Icon} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={7} className="border-0 p-0">
                    <Button
                      variant="secondary"
                      className="my-2 w-full cursor-pointer transition hover:border hover:border-dashed hover:border-[#005f5a] hover:bg-[#005f5a25]"
                      onClick={() => addInvoiceLine(draft.id)}
                    >
                      <HugeiconsIcon icon={PlusSignIcon} />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow></TableRow>
                <TableRow>
                  <TableCell colSpan={6}>Total</TableCell>
                  <TableCell className="text-right">
                    ${invoiceTotal.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Card>
        </div>

        {/* NOTES */}
        <Card className="min-h-24 p-4">
          <div className="font-semibold">Notes</div>
          <Textarea
            placeholder="Add notes here"
            onChange={(e) => handleNotesChange(e.target.value)}
          />
        </Card>
      </div>
      <div className="text-right">
        <Button id="save" type="submit" onClick={() => saveInvoice(draft)}>
          Save Invoice
          <HugeiconsIcon icon={SaveIcon} className="ml-2" />
        </Button>
      </div>
    </div>
  )
}
