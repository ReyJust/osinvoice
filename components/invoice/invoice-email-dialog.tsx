"use client"

import { useState, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  Download01Icon,
  Mail01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Invoice } from "@/lib/types/invoice"
import { formatDate } from "@/lib/formatters/formatDate"

export function InvoiceEmailDialog({ invoice }: { invoice: Invoice }) {
  const [copied, setCopied] = useState(false)

  const total = invoice.lines.reduce((sum, l) => sum + l.totalAmount, 0)
  const companyName = invoice.company?.name ?? "Us"
  const clientName = invoice.client?.name ?? "there"
  const clientEmail = invoice.client?.email ?? ""

  const emailSubject = `Invoice ${invoice.id} from ${companyName}`

  const emailBody = useMemo(() => {
    const lines = [
      `Dear ${clientName},`,
      "",
      `Please find attached Invoice ${invoice.id} dated ${formatDate(invoice.date)} for a total of $${total.toFixed(2)}.`,
    ]

    if (invoice.company?.bsb || invoice.company?.account_number) {
      lines.push("", "Payment details:")
      if (invoice.company.bsb) lines.push(`BSB: ${invoice.company.bsb}`)
      if (invoice.company.account_number)
        lines.push(`Account: ${invoice.company.account_number}`)
    }

    lines.push(
      "",
      "Please don't hesitate to reach out if you have any questions.",
      "",
      "Kind regards,",
      companyName
    )

    return lines.join("\n")
  }, [invoice, total, clientName, companyName])

  const mailtoHref = `mailto:${clientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`

  function handleCopy() {
    navigator.clipboard.writeText(emailBody)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={Mail01Icon} />
          Email Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Email Invoice</DialogTitle>
          <DialogDescription>
            Send invoice {invoice.id} to {clientName}.
            {clientEmail ? ` (${clientEmail})` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Email preview
          </div>
          <pre className="bg-muted rounded-md p-4 text-xs leading-relaxed whitespace-pre-wrap font-sans max-h-60 overflow-y-auto">
            {emailBody}
          </pre>
          <p className="text-muted-foreground text-xs">
            Note: email clients don&apos;t support automatic attachments via
            mail links. Download the PDF separately to attach it.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} />
            {copied ? "Copied!" : "Copy body"}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={mailtoHref}>
              <HugeiconsIcon icon={Mail01Icon} />
              Open Mail App
            </a>
          </Button>
          <Button variant="default" size="sm" asChild>
            <a href={`/api/invoice/${invoice.id}/pdf`} download>
              <HugeiconsIcon icon={Download01Icon} />
              Download PDF
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
