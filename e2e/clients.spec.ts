import { test, expect } from "@playwright/test"

const ts = Date.now()
const CLIENT_NAME = `E2E Client ${ts}`
const UPDATED_NAME = `E2E Client Updated ${ts}`

test.describe("Client management", () => {
  test("clients page loads with New Client button", async ({ page }) => {
    await page.goto("/client")
    await expect(page.getByRole("button", { name: "New Client" })).toBeVisible()
  })

  test("create client — dialog opens, form fills, client appears in table", async ({ page }) => {
    await page.goto("/client")
    await page.getByRole("button", { name: "New Client" }).click()

    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Create New Client" })).toBeVisible()

    await page.locator("#client-form-name").fill(CLIENT_NAME)
    await page.locator("#client-form-email").fill(`e2e-${ts}@client.com`)

    await page.locator("#client-form-country").click()
    await page.getByRole("option", { name: "Australia" }).click()

    await page.locator("#client-form-address").fill("2 Test Ave")
    await page.locator("#client-form-city").fill("Sydney")
    await page.locator("#client-form-state").fill("NSW")
    await page.locator("#client-form-postcode").fill("2000")

    await page.getByRole("button", { name: "Save changes" }).click()

    await expect(page.getByRole("dialog")).not.toBeVisible()
    await expect(page.getByText(CLIENT_NAME, { exact: false })).toBeVisible()
  })

  test("search filters clients", async ({ page }) => {
    await page.goto("/client")
    const input = page.getByPlaceholder(/search/i)
    await input.fill(CLIENT_NAME)
    await expect(page.getByText(CLIENT_NAME, { exact: false })).toBeVisible()
    await input.fill("zzznomatch___")
    await expect(page.getByText("No results.")).toBeVisible()
  })

  test("update client — edit dialog opens pre-filled and saves changes", async ({ page }) => {
    await page.goto("/client")

    const row = page.getByRole("row").filter({ hasText: CLIENT_NAME })
    // Edit button is the first icon button (default/teal variant)
    await row.getByRole("button").nth(0).click()

    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Edit Client" })).toBeVisible()
    await expect(page.locator("#client-form-name")).toHaveValue(CLIENT_NAME)

    await page.locator("#client-form-name").fill(UPDATED_NAME)
    await page.getByRole("button", { name: "Save changes" }).click()

    await expect(page.getByRole("dialog")).not.toBeVisible()
    await expect(page.getByText(UPDATED_NAME, { exact: false })).toBeVisible()
  })

  test("delete client — confirmation dialog appears and client is removed", async ({ page }) => {
    await page.goto("/client")

    const row = page.getByRole("row").filter({ hasText: UPDATED_NAME })
    // Delete button is the last (destructive/red) icon button in the row
    await row.getByRole("button").last().click()

    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Confirmation" })).toBeVisible()
    await expect(page.getByText(new RegExp(`delete ${UPDATED_NAME}`, "i"))).toBeVisible()

    await page.getByRole("button", { name: "Delete" }).click()

    await expect(page.getByRole("dialog")).not.toBeVisible()
    await expect(page.getByText(UPDATED_NAME, { exact: false })).not.toBeVisible()
  })
})
