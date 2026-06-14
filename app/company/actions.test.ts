import { describe, it, expect, vi, beforeEach } from "vitest"

let currentClient: any = null

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn().mockImplementation(() => Promise.resolve(currentClient)),
}))

import { revalidatePath } from "next/cache"
import { createCompany, updateCompany, deleteCompany } from "./actions"
import type { CompanyInput } from "@/lib/types/company"

const testUser = { id: "user-abc-123" }

const baseInput: CompanyInput = {
  name: "Acme Corp",
  email: "acme@corp.com",
  address: "1 Corp St",
  city: "Melbourne",
  state: "VIC",
  postcode: "3000",
  country: "AU",
  bsb: "123-456",
  account_number: "99887766",
}

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

describe("Company server actions", () => {
  beforeEach(() => {
    currentClient = makeClient()
    vi.mocked(revalidatePath).mockClear()
  })

  // --- createCompany ---
  describe("createCompany", () => {
    it("inserts into the companies table with all fields", async () => {
      await createCompany(baseInput)
      const q = currentClient._q
      expect(currentClient.from).toHaveBeenCalledWith("companies")
      expect(q.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: baseInput.name,
          email: baseInput.email,
          address: baseInput.address,
          city: baseInput.city,
          state: baseInput.state,
          postcode: baseInput.postcode,
          country: baseInput.country,
          bsb: baseInput.bsb,
          account_number: baseInput.account_number,
          user_id: testUser.id,
        })
      )
    })

    it("revalidates /company after creation", async () => {
      await createCompany(baseInput)
      expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/company")
    })

    it("throws when supabase returns an error", async () => {
      currentClient = makeClient({ data: null, error: { message: "Insert failed" } as any })
      await expect(createCompany(baseInput)).rejects.toThrow("Insert failed")
    })

    it("returns early without inserting when user is not authenticated", async () => {
      currentClient = makeClient({ data: null, error: null }, null)
      await createCompany(baseInput)
      expect(currentClient.from).not.toHaveBeenCalled()
      expect(vi.mocked(revalidatePath)).not.toHaveBeenCalled()
    })
  })

  // --- updateCompany ---
  describe("updateCompany", () => {
    it("updates the correct company scoped to the user", async () => {
      await updateCompany(7, baseInput)
      const q = currentClient._q
      expect(currentClient.from).toHaveBeenCalledWith("companies")
      expect(q.update).toHaveBeenCalledWith(baseInput)
      expect(q.eq).toHaveBeenCalledWith("id", 7)
      expect(q.eq).toHaveBeenCalledWith("user_id", testUser.id)
    })

    it("revalidates /company after update", async () => {
      await updateCompany(7, baseInput)
      expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/company")
    })

    it("throws when supabase returns an error", async () => {
      currentClient = makeClient({ data: null, error: { message: "Update failed" } as any })
      await expect(updateCompany(7, baseInput)).rejects.toThrow("Update failed")
    })

    it("returns early without updating when user is not authenticated", async () => {
      currentClient = makeClient({ data: null, error: null }, null)
      await updateCompany(7, baseInput)
      expect(currentClient.from).not.toHaveBeenCalled()
    })
  })

  // --- deleteCompany ---
  describe("deleteCompany", () => {
    it("deletes the correct company scoped to the user", async () => {
      await deleteCompany(3)
      const q = currentClient._q
      expect(currentClient.from).toHaveBeenCalledWith("companies")
      expect(q.delete).toHaveBeenCalled()
      expect(q.eq).toHaveBeenCalledWith("id", 3)
      expect(q.eq).toHaveBeenCalledWith("user_id", testUser.id)
    })

    it("revalidates /company after deletion", async () => {
      await deleteCompany(3)
      expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/company")
    })

    it("throws when supabase returns an error", async () => {
      currentClient = makeClient({ data: null, error: { message: "Delete failed" } as any })
      await expect(deleteCompany(3)).rejects.toThrow("Delete failed")
    })

    it("returns early without deleting when user is not authenticated", async () => {
      currentClient = makeClient({ data: null, error: null }, null)
      await deleteCompany(3)
      expect(currentClient.from).not.toHaveBeenCalled()
    })
  })
})
