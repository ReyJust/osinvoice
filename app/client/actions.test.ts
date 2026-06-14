import { describe, it, expect, vi, beforeEach } from "vitest"

let currentClient: any = null

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
// Mocked so transitive imports (lib/clients.ts) don't hit real Supabase
vi.mock("@/utils/supabase/require-user", () => ({
  requireUser: vi.fn().mockResolvedValue({ id: "user-abc-123" }),
}))
vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn().mockImplementation(() => Promise.resolve(currentClient)),
}))

import { revalidatePath } from "next/cache"
import {
  createClient as createClientAction,
  updateClient,
  deleteClient,
} from "./actions"
import type { ClientInput } from "@/lib/types/client"

const testUser = { id: "user-abc-123" }

const baseInput: ClientInput = {
  name: "John Smith",
  email: "john@smith.com",
  address: "2 Client Ave",
  city: "Sydney",
  state: "NSW",
  postcode: "2000",
  country: "AU",
}

/**
 * Returns a Supabase client mock.
 * - client: NOT thenable (createClient resolves to this, not through it)
 * - client._q: the query chain object (thenable — direct awaits resolve to result)
 * - client.auth.getUser(): resolves to { data: { user }, error: null }
 */
function makeClient(
  result = { data: null, error: null },
  user: any = testUser
) {
  const q: any = {}
  ;["insert", "update", "delete", "select", "eq"].forEach((m) => {
    q[m] = vi.fn().mockReturnValue(q)
  })
  q.maybeSingle = vi.fn().mockResolvedValue(result)
  q.single = vi.fn().mockResolvedValue(result)
  q.then = (resolve: any, reject?: any) => Promise.resolve(result).then(resolve, reject)

  const client: any = {
    from: vi.fn().mockReturnValue(q),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
    },
    _q: q,
  }

  return client
}

describe("Client server actions", () => {
  beforeEach(() => {
    currentClient = makeClient()
    vi.mocked(revalidatePath).mockClear()
  })

  // --- createClient ---
  describe("createClient", () => {
    it("inserts into the clients table with all fields", async () => {
      await createClientAction(baseInput)
      const q = currentClient._q
      expect(currentClient.from).toHaveBeenCalledWith("clients")
      expect(q.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: baseInput.name,
          email: baseInput.email,
          address: baseInput.address,
          city: baseInput.city,
          state: baseInput.state,
          postcode: baseInput.postcode,
          country: baseInput.country,
          user_id: testUser.id,
        })
      )
    })

    it("revalidates /client after creation", async () => {
      await createClientAction(baseInput)
      expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/client")
    })

    it("throws when supabase returns an error", async () => {
      currentClient = makeClient({ data: null, error: { message: "Insert failed" } as any })
      await expect(createClientAction(baseInput)).rejects.toThrow("Insert failed")
    })

    it("returns early without inserting when user is not authenticated", async () => {
      currentClient = makeClient({ data: null, error: null }, null)
      await createClientAction(baseInput)
      expect(currentClient.from).not.toHaveBeenCalled()
      expect(vi.mocked(revalidatePath)).not.toHaveBeenCalled()
    })
  })

  // --- updateClient ---
  describe("updateClient", () => {
    it("updates the correct client scoped to the user", async () => {
      await updateClient(42, baseInput)
      const q = currentClient._q
      expect(currentClient.from).toHaveBeenCalledWith("clients")
      expect(q.update).toHaveBeenCalledWith(baseInput)
      expect(q.eq).toHaveBeenCalledWith("id", 42)
      expect(q.eq).toHaveBeenCalledWith("user_id", testUser.id)
    })

    it("revalidates /client after update", async () => {
      await updateClient(42, baseInput)
      expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/client")
    })

    it("throws when supabase returns an error", async () => {
      currentClient = makeClient({ data: null, error: { message: "Update failed" } as any })
      await expect(updateClient(42, baseInput)).rejects.toThrow("Update failed")
    })

    it("returns early without updating when user is not authenticated", async () => {
      currentClient = makeClient({ data: null, error: null }, null)
      await updateClient(42, baseInput)
      expect(currentClient.from).not.toHaveBeenCalled()
    })
  })

  // --- deleteClient ---
  describe("deleteClient", () => {
    it("deletes the correct client scoped to the user", async () => {
      await deleteClient(99)
      const q = currentClient._q
      expect(currentClient.from).toHaveBeenCalledWith("clients")
      expect(q.delete).toHaveBeenCalled()
      expect(q.eq).toHaveBeenCalledWith("id", 99)
      expect(q.eq).toHaveBeenCalledWith("user_id", testUser.id)
    })

    it("revalidates /client after deletion", async () => {
      await deleteClient(99)
      expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/client")
    })

    it("throws when supabase returns an error", async () => {
      currentClient = makeClient({ data: null, error: { message: "Delete failed" } as any })
      await expect(deleteClient(99)).rejects.toThrow("Delete failed")
    })

    it("returns early without deleting when user is not authenticated", async () => {
      currentClient = makeClient({ data: null, error: null }, null)
      await deleteClient(99)
      expect(currentClient.from).not.toHaveBeenCalled()
    })
  })
})
