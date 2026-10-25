import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import InvoiceEditor from "./invoice-editor"

vi.mock("@/app/client/actions", () => ({ createClient: vi.fn() }))
vi.mock("@/app/company/actions", () => ({ createCompany: vi.fn() }))
vi.mock("@/app/invoice/actions", () => ({
  createInvoice: vi.fn(),
  updateInvoice: vi.fn(),
}))
vi.mock("@/utils/supabase/client", () => ({
  useSupabase: vi.fn(() => ({})),
}))
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}))

const defaultProps = {
  clients: [],
  companies: [],
}

describe("InvoiceEditor — guest mode", () => {
  it("renders Finish button", () => {
    render(<InvoiceEditor {...defaultProps} isGuest={true} />)
    expect(screen.getByRole("button", { name: /finish/i })).toBeInTheDocument()
  })

  it("does not render Save Invoice button", () => {
    render(<InvoiceEditor {...defaultProps} isGuest={true} />)
    expect(
      screen.queryByRole("button", { name: /save invoice/i })
    ).not.toBeInTheDocument()
  })

  it("renders guest banner with Sign up link pointing to /signup", () => {
    render(<InvoiceEditor {...defaultProps} isGuest={true} />)
    const link = screen.getByRole("link", { name: /sign up/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/signup")
  })

  it("does not render a separate Email Invoice button", () => {
    render(<InvoiceEditor {...defaultProps} isGuest={true} />)
    expect(
      screen.queryByRole("button", { name: /email invoice/i })
    ).not.toBeInTheDocument()
  })
})

describe("InvoiceEditor — authenticated mode", () => {
  it("renders Save Invoice button", () => {
    render(<InvoiceEditor {...defaultProps} isGuest={false} />)
    expect(
      screen.getByRole("button", { name: /save invoice/i })
    ).toBeInTheDocument()
  })

  it("does not render guest banner", () => {
    render(<InvoiceEditor {...defaultProps} isGuest={false} />)
    expect(
      screen.queryByRole("link", { name: /sign up/i })
    ).not.toBeInTheDocument()
  })

  it("does not render Finish button", () => {
    render(<InvoiceEditor {...defaultProps} isGuest={false} />)
    expect(
      screen.queryByRole("button", { name: /finish/i })
    ).not.toBeInTheDocument()
  })
})

describe("InvoiceEditor — editing existing invoice", () => {
  it("shows saved notes in the notes field", () => {
    render(
      <InvoiceEditor
        {...defaultProps}
        initialInvoice={{
          id: "INV-20261025-ABC123",
          created_at: "",
          date: "2026-10-25",
          company: null,
          client: null,
          status: "unpaid",
          lines: [],
          notes: "Payment due within 14 days",
        }}
      />
    )
    expect(screen.getByPlaceholderText(/add notes here/i)).toHaveValue(
      "Payment due within 14 days"
    )
  })
})
