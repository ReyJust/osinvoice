import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import { Invoice } from "@/lib/types/invoice"
import { formatDate } from "@/lib/formatters/formatDate"
import { formatAddress } from "@/lib/formatters/formatAddress"

const teal = "#005f5a"
const muted = "#6b7280"
const border = "#e5e7eb"

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 48,
    color: "#111827",
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: teal,
    marginBottom: 4,
  },
  muted: {
    color: muted,
    fontSize: 9,
  },
  invoiceLabel: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: teal,
    textAlign: "right",
    letterSpacing: 2,
  },
  metaRight: {
    alignItems: "flex-end",
  },
  metaRow: {
    flexDirection: "row",
    gap: 4,
  },
  metaLabel: {
    color: muted,
    fontSize: 9,
  },
  metaValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: border,
    marginBottom: 24,
  },
  billTo: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  clientName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: teal,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 0,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: border,
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    fontSize: 9,
  },
  colDate: { width: "15%" },
  colDesc: { width: "40%" },
  colPrice: { width: "15%", textAlign: "right" },
  colQty: { width: "10%", textAlign: "center" },
  colAmount: { width: "20%", textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 10,
    paddingHorizontal: 8,
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: muted,
    marginRight: 16,
  },
  totalAmount: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: teal,
  },
  notesSection: {
    marginTop: 28,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderLeftWidth: 3,
    borderLeftColor: teal,
  },
  notesText: {
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.6,
  },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: border,
  },
  footerRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 2,
  },
  footerLabel: {
    fontSize: 9,
    color: muted,
    width: 80,
  },
  footerValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
})

export function InvoicePDFDocument({ invoice }: { invoice: Invoice }) {
  const total = invoice.lines.reduce((sum, line) => sum + line.totalAmount, 0)
  const companyAddress = invoice.company
    ? formatAddress({
        address: invoice.company.address,
        city: invoice.company.city,
        state: invoice.company.state,
        postcode: invoice.company.postcode,
      })
    : ""
  const clientAddress = invoice.client
    ? formatAddress(
        {
          address: invoice.client.address,
          city: invoice.client.city,
          state: invoice.client.state,
          postcode: invoice.client.postcode,
        },
        true
      )
    : ""

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.companyName}>
              {invoice.company?.name ?? "Your Company"}
            </Text>
            {companyAddress ? (
              <Text style={s.muted}>{companyAddress}</Text>
            ) : null}
            {invoice.company?.email ? (
              <Text style={s.muted}>{invoice.company.email}</Text>
            ) : null}
          </View>
          <View style={s.metaRight}>
            <Text style={s.invoiceLabel}>INVOICE</Text>
            <Text style={{ ...s.muted, marginTop: 4 }}>#{invoice.id}</Text>
            <View style={{ ...s.metaRow, marginTop: 4 }}>
              <Text style={s.metaLabel}>Date: </Text>
              <Text style={s.metaValue}>{formatDate(invoice.date)}</Text>
            </View>
            <View style={{ ...s.metaRow, marginTop: 2 }}>
              <Text style={s.metaLabel}>Status: </Text>
              <Text style={s.metaValue}>
                {invoice.status === "paid" ? "Paid" : "Unpaid"}
              </Text>
            </View>
          </View>
        </View>

        <View style={s.divider} />

        {/* Bill To */}
        <View style={s.billTo}>
          <Text style={s.sectionLabel}>Bill To</Text>
          <Text style={s.clientName}>
            {invoice.client?.name ?? "—"}
          </Text>
          {clientAddress ? (
            <Text style={s.muted}>{clientAddress}</Text>
          ) : null}
          {invoice.client?.email ? (
            <Text style={s.muted}>{invoice.client.email}</Text>
          ) : null}
        </View>

        {/* Line Items */}
        <View>
          <View style={s.tableHeader}>
            <Text style={{ ...s.tableHeaderText, ...s.colDate }}>Date</Text>
            <Text style={{ ...s.tableHeaderText, ...s.colDesc }}>
              Description
            </Text>
            <Text style={{ ...s.tableHeaderText, ...s.colPrice }}>
              Unit Price
            </Text>
            <Text style={{ ...s.tableHeaderText, ...s.colQty }}>Qty</Text>
            <Text style={{ ...s.tableHeaderText, ...s.colAmount }}>Amount</Text>
          </View>
          {invoice.lines.map((line, i) => (
            <View
              key={line.id}
              style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}
            >
              <Text style={{ ...s.tableCell, ...s.colDate }}>
                {formatDate(line.date)}
              </Text>
              <Text style={{ ...s.tableCell, ...s.colDesc }}>
                {line.description}
              </Text>
              <Text style={{ ...s.tableCell, ...s.colPrice }}>
                ${line.unitPrice.toFixed(2)}
              </Text>
              <Text style={{ ...s.tableCell, ...s.colQty }}>
                {line.quantity}
              </Text>
              <Text style={{ ...s.tableCell, ...s.colAmount }}>
                ${line.totalAmount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>TOTAL</Text>
          <Text style={s.totalAmount}>${total.toFixed(2)}</Text>
        </View>

        {/* Notes */}
        {invoice.notes ? (
          <View style={s.notesSection}>
            <Text style={{ ...s.sectionLabel, marginBottom: 4 }}>Notes</Text>
            <Text style={s.notesText}>{invoice.notes}</Text>
          </View>
        ) : null}

        {/* Payment Details */}
        {invoice.company?.bsb || invoice.company?.account_number ? (
          <View style={s.footer}>
            <Text style={s.sectionLabel}>Payment Details</Text>
            {invoice.company.bsb ? (
              <View style={s.footerRow}>
                <Text style={s.footerLabel}>BSB</Text>
                <Text style={s.footerValue}>{invoice.company.bsb}</Text>
              </View>
            ) : null}
            {invoice.company.account_number ? (
              <View style={s.footerRow}>
                <Text style={s.footerLabel}>Account Number</Text>
                <Text style={s.footerValue}>
                  {invoice.company.account_number}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </Page>
    </Document>
  )
}
