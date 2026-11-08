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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Invoice } from "@/lib/types/invoice"
import {
  applyMergeTags,
  EMAIL_TEMPLATE_LABELS,
  EmailTemplateKind,
  EmailTemplates,
  pickEmailTemplate,
  resolveEmailTemplates,
} from "@/lib/email-template"

export function InvoiceEmailDialog({
  invoice,
  templates,
  onDownloadPdf,
  triggerLabel = "Email Invoice",
  iconOnly = false,
}: {
  invoice: Invoice
  templates?: Partial<EmailTemplates>
  onDownloadPdf?: () => void
  triggerLabel?: string
  iconOnly?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const companyName = invoice.company?.name ?? "Us"
  const clientName = invoice.client?.name ?? "there"
  const clientEmail = invoice.client?.email ?? ""

  const emailSubject = `Invoice ${invoice.id} from ${companyName}`

  const allTemplates = useMemo(
    () => ({ ...resolveEmailTemplates(null), ...templates }),
    [templates]
  )
  const [kind, setKind] = useState<EmailTemplateKind>(() =>
    pickEmailTemplate(invoice)
  )

  const bodyFor = (k: EmailTemplateKind) =>
    applyMergeTags(allTemplates[k], invoice)

  const [editedBody, setEditedBody] = useState(() => bodyFor(kind))

  function handleOpenChange(next: boolean) {
    if (next) {
      const best = pickEmailTemplate(invoice)
      setKind(best)
      setEditedBody(bodyFor(best))
    }
    setOpen(next)
  }

  function handleKindChange(next: EmailTemplateKind) {
    setKind(next)
    setEditedBody(bodyFor(next))
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
        {iconOnly ? (
          <Button
            variant="outline"
            size="icon"
            aria-label={triggerLabel}
            title={triggerLabel}
          >
            <HugeiconsIcon icon={Mail01Icon} />
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={Mail01Icon} />
            {triggerLabel}
          </Button>
        )}
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
          <div className="flex items-center justify-between gap-2">
            <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Email body
            </div>
            <Select
              value={kind}
              onValueChange={(v) => handleKindChange(v as EmailTemplateKind)}
            >
              <SelectTrigger
                size="sm"
                aria-label="Email template"
                className="w-auto"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(EMAIL_TEMPLATE_LABELS) as EmailTemplateKind[]).map(
                  (k) => (
                    <SelectItem key={k} value={k}>
                      {EMAIL_TEMPLATE_LABELS[k]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
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
