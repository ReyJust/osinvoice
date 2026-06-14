import { describe, it, expect, vi, beforeEach } from "vitest"

let currentClient: any = null
let currentUser: any = null

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("@/utils/supabase/require-user", () => ({
  requireUser: vi.fn().mockImplementation(async () => currentUser),
}))
vi.mock("@/utils/supabase/server", () => ({
  // Must NOT be thenable — if the resolved value has .then, await unwraps it
  // and supabase ends up as the query result rather than the client object.
  createClient: vi.fn().mockImplementation(() => Promise.resolve(currentClient)),
}))

import { revalidatePath } from "next/cache"
import {
  createInvoice,
  moveInvoiceToTrash,
  restoreInvoiceFromTrash,
  deleteInvoicePermanently,
  changeInvoiceStatus,
  updateInvoice,
} from "./actions"
import { requireUser } from "@/utils/supabase/require-user"
import type { InvoiceInput } from "@/lib/types/invoice"

const testUser = { id: "user-abc-123" }

const baseInvoice: InvoiceInput = {
  id: "INV-20260613-ABCDEF",
  company: {
    id: 1,
    name: "Test Co",
    email: "co@test.com",
    address: "1 St",
    city: "Melb",
    state: "VIC",
    postcode: "3000",
    country: "AU",
    bsb: "123-456",
    account_number: "99999999",
    created_at: "",
  },
  client: {
    id: 2,
    name: "Client A",
    email: "a@client.com",
    address: "2 Ave",
    city: "Syd",
    state: "NSW",
    postcode: "2000",
    country: "AU",
    created_at: "",
  },
  status: "unpaid",
  date: new Date("2026-06-13").toISOString(),
  lines: [],
  notes: "",
}

/**
 * Returns { client, query }:
 *  - client: NOT thenable — createClient() must resolve to this, not unwrap it
 *  - query: thenable — the query chain (returned by .from()) resolves to result
 */
function makeBuilder(result = { data: null, error: null }) {
  const q: any = {}
  ;["insert", "update", "delete", "select", "eq"].forEach((m) => {
    q[m] = vi.fn().mockReturnValue(q)
  })
  q.single = vi.fn().mockResolvedValue(result)
  q.maybeSingle = vi.fn().mockResolvedValue(result)
  q.then = (resolve: any, reject?: any) => Promise.resolve(result).then(resolve, reject)

  const client: any = {
    from: vi.fn().mockReturnValue(q),
    _q: q,
  }

  return client
}

describe("Invoice server actions", () => {
  beforeEach(() => {
    currentClient = makeBuilder()
    currentUser = testUser
    vi.mocked(revalidatePath).mockClear()
  })

  // --- createInvoice ---
  describe("createInvoice", () => {
    it("calls supabase.insert with correct fields", async () => {
      await createInvoice(baseInvoice)
      const q = currentClient._q
      expect(currentClient.from).toHaveBeenCalledWith("invoices")
      expect(q.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: baseInvoice.id,
          company_id: baseInvoice.company?.id,
          client_id: baseInvoice.client?.id,
          user_id: testUser.id,
          status: "unpaid",
        })
      )
    })

    it("revalidates /invoice path after creation", async () => {
      await createInvoice(baseInvoice)
      expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/invoice")
    })

    it("throws when supabase returns an error", async () => {
      currentClient = makeBuilder({ data: null, error: { message: "DB error" } as any })
      await expect(createInvoice(baseInvoice)).rejects.toThrow("DB error")
    })
  })

  // --- moveInvoiceToTrash ---
  describe("moveInvoiceToTrash", () => {
    it("sets deleted=true scoped to user", async () => {
      await moveInvoiceToTrash("INV-123")
      const q = currentClient._q
      expect(currentClient.from).toHaveBeenCalledWith("invoices")
      expect(q.update).toHaveBeenCalledWith({ deleted: true })
      expect(q.eq).toHaveBeenCalledWith("id", "INV-123")
      expect(q.eq).toHaveBeenCalledWith("user_id", testUser.id)
    })

    it("revalidates /invoice path", async () => {
      await moveInvoiceToTrash("INV-123")
      expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/invoice")
    })

    it("throws when supabase returns an error", async () => {
      currentClient = makeBuilder({ data: null, error: { message: "Cannot trash" } as any })
      await expect(moveInvoiceToTrash("INV-123")).rejects.toThrow("Cannot trash")
    })
  })

  // --- restoreInvoiceFromTrash ---
  describe("restoreInvoiceFromTrash", () => {
    it("sets deleted=false scoped to user", async () => {
      await restoreInvoiceFromTrash("INV-456")
      const q = currentClient._q
      expect(q.update).toHaveBeenCalledWith({ deleted: false })
      expect(q.eq).toHaveBeenCalledWith("id", "INV-456")
      expect(q.eq).toHaveBeenCalledWith("user_id", testUser.id)
    })

    it("revalidates /invoice path", async () => {
      await restoreInvoiceFromTrash("INV-456")
      expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/invoice")
    })

    it("throws when supabase returns an error", async () => {
      currentClient = makeBuilder({ data: null, error: { message: "Cannot restore" } as any })
      await expect(restoreInvoiceFromTrash("INV-456")).rejects.toThrow("Cannot restore")
    })
  })

  // --- deleteInvoicePermanently ---
  describe("deleteInvoicePermanently", () => {
    it("calls delete scoped to user", async () => {
      await deleteInvoicePermanently("INV-789")
      const q = currentClient._q
      expect(currentClient.from).toHaveBeenCalledWith("invoices")
      expect(q.delete).toHaveBeenCalled()
      expect(q.eq).toHaveBeenCalledWith("id", "INV-789")
      expect(q.eq).toHaveBeenCalledWith("user_id", testUser.id)
    })

    it("revalidates /invoice path", async () => {
      await deleteInvoicePermanently("INV-789")
      expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/invoice")
    })

    it("throws when supabase returns an error", async () => {
      currentClient = makeBuilder({ data: null, error: { message: "Cannot delete" } as any })
      await expect(deleteInvoicePermanently("INV-789")).rejects.toThrow("Cannot delete")
    })
  })

  // --- changeInvoiceStatus ---
  describe("changeInvoiceStatus", () => {
    it("sets status to paid", async () => {
      await changeInvoiceStatus("INV-001", "paid")
      const q = currentClient._q
      expect(q.update).toHaveBeenCalledWith({ status: "paid" })
      expect(q.eq).toHaveBeenCalledWith("id", "INV-001")
      expect(q.eq).toHaveBeenCalledWith("user_id", testUser.id)
    })

    it("sets status to unpaid", async () => {
      await changeInvoiceStatus("INV-001", "unpaid")
      expect(currentClient._q.update).toHaveBeenCalledWith({ status: "unpaid" })
    })

    it("revalidates /invoice path", async () => {
      await changeInvoiceStatus("INV-001", "paid")
      expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/invoice")
    })

    it("throws when supabase returns an error", async () => {
      currentClient = makeBuilder({ data: null, error: { message: "Cannot update status" } as any })
      await expect(changeInvoiceStatus("INV-001", "paid")).rejects.toThrow("Cannot update status")
    })
  })

  // --- updateInvoice ---
  describe("updateInvoice", () => {
    it("updates invoice fields scoped to user", async () => {
      await updateInvoice("INV-UPDATE", baseInvoice)
      const q = currentClient._q
      expect(q.update).toHaveBeenCalledWith(
        expect.objectContaining({
          company_id: baseInvoice.company?.id,
          client_id: baseInvoice.client?.id,
          status: baseInvoice.status,
        })
      )
      expect(q.eq).toHaveBeenCalledWith("id", "INV-UPDATE")
      expect(q.eq).toHaveBeenCalledWith("user_id", testUser.id)
    })

    it("revalidates /invoice path", async () => {
      await updateInvoice("INV-UPDATE", baseInvoice)
      expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/invoice")
    })

    it("throws when supabase returns an error", async () => {
      currentClient = makeBuilder({ data: null, error: { message: "Cannot update" } as any })
      await expect(updateInvoice("INV-UPDATE", baseInvoice)).rejects.toThrow("Cannot update")
    })
  })

  // --- auth guard ---
  describe("auth guard", () => {
    it("propagates error when requireUser throws Unauthorized", async () => {
      vi.mocked(requireUser).mockRejectedValueOnce(new Error("Unauthorized"))
      await expect(moveInvoiceToTrash("INV-X")).rejects.toThrow("Unauthorized")
    })
  })
})
