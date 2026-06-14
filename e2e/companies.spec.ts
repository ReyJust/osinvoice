import { test, expect } from "@playwright/test"

const ts = Date.now()
const COMPANY_NAME = `E2E Corp ${ts}`
const UPDATED_NAME = `E2E Corp Updated ${ts}`

test.describe("Company management", () => {
  test("companies page loads with New Company button", async ({ page }) => {
    await page.goto("/company")
    await expect(page.getByRole("button", { name: "New Company" })).toBeVisible()
  })

  test("create company — dialog opens, form fills, company appears in table", async ({ page }) => {
    await page.goto("/company")
    await page.getByRole("button", { name: "New Company" }).click()

    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Create New Company" })).toBeVisible()

    await page.locator("#company-form-name").fill(COMPANY_NAME)
    await page.locator("#company-form-email").fill(`e2e-${ts}@corp.com`)

    // Select country — open the select and pick Australia
    await page.locator("#company-form-country").click()
    await page.getByRole("option", { name: "Australia" }).click()

    await page.locator("#company-form-bsb").fill("123-456")
    await page.locator("#company-form-account_number").fill("99887766")
    await page.locator("#company-form-address").fill("1 Test St")
    await page.locator("#company-form-city").fill("Melbourne")
    await page.locator("#company-form-state").fill("VIC")
    await page.locator("#company-form-postcode").fill("3000")

    await page.getByRole("button", { name: "Save changes" }).click()

    // Dialog should close and company should appear in the table
    await expect(page.getByRole("dialog")).not.toBeVisible()
    await expect(page.getByText(COMPANY_NAME, { exact: false })).toBeVisible()
  })

  test("search filters companies", async ({ page }) => {
    await page.goto("/company")
    const input = page.getByPlaceholder(/search/i)
    await input.fill(COMPANY_NAME)
    await expect(page.getByText(COMPANY_NAME, { exact: false })).toBeVisible()
    await input.fill("zzznomatch___")
    await expect(page.getByText("No results.")).toBeVisible()
  })

  test("update company — edit dialog opens pre-filled and saves changes", async ({ page }) => {
    await page.goto("/company")

    // Find the row containing our company and click the edit (default/teal) button
    const row = page.getByRole("row").filter({ hasText: COMPANY_NAME })
    // Edit button is the first icon button (default variant) in the actions cell
    await row.getByRole("button").nth(1).click()

    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Edit Company" })).toBeVisible()

    // Name field should be pre-filled
    await expect(page.locator("#company-form-name")).toHaveValue(COMPANY_NAME)

    // Update the name
    await page.locator("#company-form-name").fill(UPDATED_NAME)
    await page.getByRole("button", { name: "Save changes" }).click()

    await expect(page.getByRole("dialog")).not.toBeVisible()
    await expect(page.getByText(UPDATED_NAME, { exact: false })).toBeVisible()
  })

  test("delete company — confirmation dialog appears and company is removed", async ({ page }) => {
    await page.goto("/company")

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
