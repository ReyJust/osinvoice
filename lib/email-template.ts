import { Invoice } from "@/lib/types/invoice"
import { formatDate } from "@/lib/formatters/formatDate"

export const DEFAULT_EMAIL_TEMPLATE = `Dear {clientName},

Please find attached Invoice {invoiceId} dated {date} for a total of \${amount}.

{paymentDetails}Please don't hesitate to reach out if you have any questions.

Kind regards,
{companyName}`

export function applyMergeTags(template: string, invoice: Invoice): string {
  const total = invoice.lines.reduce((sum, l) => sum + l.totalAmount, 0)

  let paymentDetails = ""
  if (invoice.company?.bsb || invoice.company?.account_number) {
    const lines = ["Payment details:"]
    if (invoice.company.bsb) lines.push(`BSB: ${invoice.company.bsb}`)
    if (invoice.company.account_number)
      lines.push(`Account: ${invoice.company.account_number}`)
    paymentDetails = lines.join("\n") + "\n\n"
  }

  return template
    .replace(/{clientName}/g, invoice.client?.name ?? "there")
    .replace(/{invoiceId}/g, invoice.id)
    .replace(/{amount}/g, total.toFixed(2))
    .replace(/{companyName}/g, invoice.company?.name ?? "Us")
    .replace(/{date}/g, formatDate(invoice.date))
    .replace(/{paymentDetails}/g, paymentDetails)
}
