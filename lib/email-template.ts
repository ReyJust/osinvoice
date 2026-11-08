import { Invoice } from "@/lib/types/invoice"
import { formatDate } from "@/lib/formatters/formatDate"

export type EmailTemplateKind = "contact" | "generic"

export type EmailTemplates = Record<EmailTemplateKind, string>

export const EMAIL_TEMPLATE_LABELS: Record<EmailTemplateKind, string> = {
  contact: "With contact name",
  generic: "Without contact name",
}

export const DEFAULT_EMAIL_TEMPLATE_CONTACT = `Dear {contactName},

Please find attached Invoice {invoiceId} dated {date} for a total of \${amount}.

{paymentDetails}Please don't hesitate to reach out if you have any questions.

Kind regards,
{companyName}`

export const DEFAULT_EMAIL_TEMPLATE = `Hello,

Please find attached Invoice {invoiceId} dated {date} for a total of \${amount}.

{paymentDetails}Please don't hesitate to reach out if you have any questions.

Kind regards,
{companyName}`

export function resolveEmailTemplates(settings?: {
  email_body_template?: string | null
  email_body_template_contact?: string | null
} | null): EmailTemplates {
  return {
    contact: settings?.email_body_template_contact || DEFAULT_EMAIL_TEMPLATE_CONTACT,
    generic: settings?.email_body_template || DEFAULT_EMAIL_TEMPLATE,
  }
}

/** Contact template when the client has a contact name, generic otherwise. */
export function pickEmailTemplate(invoice: Invoice): EmailTemplateKind {
  return invoice.client?.contact_name?.trim() ? "contact" : "generic"
}

export function applyMergeTags(template: string, invoice: Invoice): string {
  const total = invoice.lines.reduce((sum, l) => sum + l.totalAmount, 0)

  let paymentDetails = ""
  if (
    invoice.company?.bank_name ||
    invoice.company?.bsb ||
    invoice.company?.account_number
  ) {
    const lines = ["Payment details:"]
    if (invoice.company.bank_name)
      lines.push(`Bank: ${invoice.company.bank_name}`)
    if (invoice.company.bsb) lines.push(`BSB: ${invoice.company.bsb}`)
    if (invoice.company.account_number)
      lines.push(`Account: ${invoice.company.account_number}`)
    paymentDetails = lines.join("\n") + "\n\n"
  }

  return template
    .replace(/{contactName}/g, invoice.client?.contact_name?.trim() || invoice.client?.name || "there")
    .replace(/{clientName}/g, invoice.client?.name ?? "there")
    .replace(/{invoiceId}/g, invoice.id)
    .replace(/{amount}/g, total.toFixed(2))
    .replace(/{companyName}/g, invoice.company?.name ?? "Us")
    .replace(/{date}/g, formatDate(invoice.date))
    .replace(/{paymentDetails}/g, paymentDetails)
}
