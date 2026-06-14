import { describe, it, expect, vi, beforeEach } from "vitest"

let currentClient: any = null
let currentUser: any = null

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("@/utils/supabase/require-user", () => ({
  requireUser: vi.fn().mockImplementation(async () => currentUser),
}))
vi.mock("@/utils/supabase/server", () => ({
  // Return currentClient directly (no .then) so await createClient() gives the client,
  // not the query result.
  createClient: vi.fn().mockImplementation(() => Promise.resolve(currentClient)),
}))

import { moveInvoiceToTrash } from "@/app/invoice/actions"

function makeBuilder(result = { data: null, error: null }) {
  // query: thenable — await on the chain resolves to result
  const q: any = {}
  ;["insert", "update", "delete", "select", "eq"].forEach((m) => {
    q[m] = vi.fn().mockReturnValue(q)
  })
  q.single = vi.fn().mockResolvedValue(result)
  q.maybeSingle = vi.fn().mockResolvedValue(result)
  q.then = (resolve: any, reject?: any) => Promise.resolve(result).then(resolve, reject)

  // client: NOT thenable — await createClient() must yield this object, not the query result
  const client: any = {
    from: vi.fn().mockReturnValue(q),
    _query: q, // expose for assertions
  }

  return client
}

describe("closure pattern with actions", () => {
  beforeEach(() => {
    currentUser = { id: "user-abc-123" }
    currentClient = makeBuilder()
  })

  it("moveInvoiceToTrash calls update with deleted=true", async () => {
    await moveInvoiceToTrash("INV-123")
    const q = currentClient._query
    expect(currentClient.from).toHaveBeenCalledWith("invoices")
    expect(q.update).toHaveBeenCalledWith({ deleted: true })
    expect(q.eq).toHaveBeenCalledWith("id", "INV-123")
    expect(q.eq).toHaveBeenCalledWith("user_id", "user-abc-123")
  })
})
