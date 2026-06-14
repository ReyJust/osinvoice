import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { InvoiceEmailDialog } from "./invoice-email-dialog"
import { Invoice } from "@/lib/types/invoice"

const baseInvoice: Invoice = {
  id: "INV-20260613-ABC123",
  created_at: "2026-06-13T00:00:00Z",
  date: "2026-06-13",
  status: "unpaid",
  notes: "",
  lines: [
    {
      id: "line-1",
      date: "2026-06-13",
      description: "Design work",
      quantity: 2,
      unitPrice: 150,
      totalAmount: 300,
    },
  ],
  company: {
    id: 1,
    name: "Acme Corp",
    email: "acme@corp.com",
    address: "1 Corp St",
    city: "Melbourne",
    state: "VIC",
    postcode: "3000",
    country: "AU",
    bsb: "123-456",
    account_number: "99887766",
    created_at: "",
  },
  client: {
    id: 2,
    name: "John Smith",
    email: "john@smith.com",
    address: "2 Client Ave",
    city: "Sydney",
    state: "NSW",
    postcode: "2000",
    country: "AU",
    created_at: "",
  },
}

describe("InvoiceEmailDialog", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it("renders the Email Invoice trigger button", () => {
    render(<InvoiceEmailDialog invoice={baseInvoice} />)
    expect(
      screen.getByRole("button", { name: /email invoice/i })
    ).toBeInTheDocument()
  })

  it("opens the dialog when the trigger is clicked", async () => {
    render(<InvoiceEmailDialog invoice={baseInvoice} />)
    await userEvent.click(screen.getByRole("button", { name: /email invoice/i }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("shows the client name and email in the dialog description", async () => {
    render(<InvoiceEmailDialog invoice={baseInvoice} />)
    await userEvent.click(screen.getByRole("button", { name: /email invoice/i }))
    const dialog = screen.getByRole("dialog")
    // Use textContent to avoid "multiple elements" errors (name appears in description + email body)
    expect(dialog.textContent).toContain("John Smith")
    expect(dialog.textContent).toContain("john@smith.com")
  })

  it("email body contains the invoice ID", async () => {
    render(<InvoiceEmailDialog invoice={baseInvoice} />)
    await userEvent.click(screen.getByRole("button", { name: /email invoice/i }))
    const pre = document.querySelector("pre")
    expect(pre?.textContent).toContain("INV-20260613-ABC123")
  })

  it("email body contains the correct total", async () => {
    render(<InvoiceEmailDialog invoice={baseInvoice} />)
    await userEvent.click(screen.getByRole("button", { name: /email invoice/i }))
    expect(screen.getByText(/\$300\.00/)).toBeInTheDocument()
  })

  it("email body contains company BSB and account number", async () => {
    render(<InvoiceEmailDialog invoice={baseInvoice} />)
    await userEvent.click(screen.getByRole("button", { name: /email invoice/i }))
    expect(screen.getByText(/123-456/)).toBeInTheDocument()
    expect(screen.getByText(/99887766/)).toBeInTheDocument()
  })

  it("Open Mail App link has correct mailto href", async () => {
    render(<InvoiceEmailDialog invoice={baseInvoice} />)
    await userEvent.click(screen.getByRole("button", { name: /email invoice/i }))
    const mailLink = screen.getByRole("link", { name: /open mail app/i })
    const href = mailLink.getAttribute("href") ?? ""
    expect(href).toContain("mailto:john@smith.com")
    expect(href).toContain("subject=")
    expect(href).toContain("body=")
    expect(href).toContain("INV-20260613-ABC123")
  })

  it("Download PDF link points to the PDF API route", async () => {
    render(<InvoiceEmailDialog invoice={baseInvoice} />)
    await userEvent.click(screen.getByRole("button", { name: /email invoice/i }))
    const pdfLink = screen.getByRole("link", { name: /download pdf/i })
    expect(pdfLink).toHaveAttribute(
      "href",
      "/api/invoice/INV-20260613-ABC123/pdf"
    )
    expect(pdfLink).toHaveAttribute("download")
  })

  it("copies email body to clipboard when Copy button is clicked", async () => {
    render(<InvoiceEmailDialog invoice={baseInvoice} />)
    await userEvent.click(screen.getByRole("button", { name: /email invoice/i }))
    await userEvent.click(screen.getByRole("button", { name: /copy body/i }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledOnce()
    const written = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>)
      .mock.calls[0][0] as string
    expect(written).toContain("INV-20260613-ABC123")
    expect(written).toContain("John Smith")
    expect(written).toContain("Acme Corp")
  })

  it("shows 'Copied!' feedback after clicking copy", async () => {
    render(<InvoiceEmailDialog invoice={baseInvoice} />)
    await userEvent.click(screen.getByRole("button", { name: /email invoice/i }))
    await userEvent.click(screen.getByRole("button", { name: /copy body/i }))
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument()
    )
  })

  it("handles missing company gracefully (uses fallback name)", async () => {
    const noCompany: Invoice = { ...baseInvoice, company: null }
    render(<InvoiceEmailDialog invoice={noCompany} />)
    await userEvent.click(screen.getByRole("button", { name: /email invoice/i }))
    // Should not crash; fallback text "Us" used
    expect(screen.getByText(/kind regards/i)).toBeInTheDocument()
  })

  it("handles missing client gracefully", async () => {
    const noClient: Invoice = { ...baseInvoice, client: null }
    render(<InvoiceEmailDialog invoice={noClient} />)
    await userEvent.click(screen.getByRole("button", { name: /email invoice/i }))
    expect(screen.getByText(/dear there/i)).toBeInTheDocument()
  })

  it("omits payment details section when company has no BSB or account", async () => {
    const noPayment: Invoice = {
      ...baseInvoice,
      company: { ...baseInvoice.company!, bsb: "", account_number: "" },
    }
    render(<InvoiceEmailDialog invoice={noPayment} />)
    await userEvent.click(screen.getByRole("button", { name: /email invoice/i }))
    expect(screen.queryByText(/payment details/i)).not.toBeInTheDocument()
  })
})
