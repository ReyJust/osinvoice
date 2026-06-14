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
import { Textarea } from "@/components/ui/textarea"
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
import { applyMergeTags, DEFAULT_EMAIL_TEMPLATE } from "@/lib/email-template"

export function InvoiceEmailDialog({
  invoice,
  emailBodyTemplate,
  onDownloadPdf,
  triggerLabel = "Email Invoice",
}: {
  invoice: Invoice
  emailBodyTemplate?: string
  onDownloadPdf?: () => void
  triggerLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const companyName = invoice.company?.name ?? "Us"
  const clientName = invoice.client?.name ?? "there"
  const clientEmail = invoice.client?.email ?? ""

  const emailSubject = `Invoice ${invoice.id} from ${companyName}`

  const resolvedBody = useMemo(
    () => applyMergeTags(emailBodyTemplate ?? DEFAULT_EMAIL_TEMPLATE, invoice),
    [invoice, emailBodyTemplate]
  )

  const [editedBody, setEditedBody] = useState(resolvedBody)

  function handleOpenChange(next: boolean) {
    if (next) setEditedBody(resolvedBody)
    setOpen(next)
  }

  const mailtoHref = `mailto:${clientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(editedBody)}`

  function handleCopy() {
    navigator.clipboard.writeText(editedBody)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={Mail01Icon} />
          {triggerLabel}
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
            Email body
          </div>
          <Textarea
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
            className="min-h-48 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
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
          {onDownloadPdf ? (
            <Button variant="default" size="sm" onClick={onDownloadPdf}>
              <HugeiconsIcon icon={Download01Icon} />
              Download PDF
            </Button>
          ) : (
            <Button variant="default" size="sm" asChild>
              <a href={`/api/invoice/${invoice.id}/pdf`} download>
                <HugeiconsIcon icon={Download01Icon} />
                Download PDF
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
