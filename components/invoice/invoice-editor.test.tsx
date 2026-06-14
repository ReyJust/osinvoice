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
