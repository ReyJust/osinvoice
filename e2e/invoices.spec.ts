import { test, expect, Page } from "@playwright/test"

const ts = Date.now()
const COMPANY_NAME = `INV Corp ${ts}`
const CLIENT_NAME = `INV Client ${ts}`

// Helpers for creating fixtures via the UI
async function createCompanyFixture(page: Page) {
  await page.goto("/company")
  await page.getByRole("button", { name: "New Company" }).first().click()
  await page.locator("#company-form-name").fill(COMPANY_NAME)
  await page.locator("#company-form-email").fill(`inv-co-${ts}@test.com`)
  await page.locator("#company-form-country").click()
  await page.getByRole("option", { name: "Australia" }).click()
  await page.locator("#company-form-bsb").fill("123-456")
  await page.locator("#company-form-account_number").fill("99887766")
  await page.locator("#company-form-address").fill("1 Invoice St")
  await page.locator("#company-form-city").fill("Melbourne")
  await page.locator("#company-form-state").fill("VIC")
  await page.locator("#company-form-postcode").fill("3000")
  await page.getByRole("button", { name: "Save changes" }).click()
  await expect(page.getByRole("dialog")).not.toBeVisible()
}

async function createClientFixture(page: Page) {
  await page.goto("/client")
  await page.getByRole("button", { name: "New Client" }).first().click()
  await page.locator("#client-form-name").fill(CLIENT_NAME)
  await page.locator("#client-form-email").fill(`inv-cl-${ts}@test.com`)
  await page.locator("#client-form-country").click()
  await page.getByRole("option", { name: "Australia" }).click()
  await page.locator("#client-form-address").fill("2 Invoice Ave")
  await page.locator("#client-form-city").fill("Sydney")
  await page.locator("#client-form-state").fill("NSW")
  await page.locator("#client-form-postcode").fill("2000")
  await page.getByRole("button", { name: "Save changes" }).click()
  await expect(page.getByRole("dialog")).not.toBeVisible()
}

test.describe("Invoice management", () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await createCompanyFixture(page)
    await createClientFixture(page)
    await context.close()
  })

  // --- Invoice list ---

  test("invoice list page loads with New Invoice button", async ({ page }) => {
    await page.goto("/invoice")
    await expect(page.getByRole("button", { name: "New Invoice" }).first()).toBeVisible()
  })

  // --- Create invoice ---

  test("create invoice — fills form and invoice appears in list", async ({ page }) => {
    await page.goto("/invoice/new")

    // Select company via combobox
    const companyCombobox = page.getByRole("combobox").first()
    await companyCombobox.click()
    await companyCombobox.fill(COMPANY_NAME)
    await page.getByRole("option", { name: COMPANY_NAME }).first().click()

    // Select client via combobox
    const clientCombobox = page.getByRole("combobox").nth(1)
    await clientCombobox.click()
    await clientCombobox.fill(CLIENT_NAME)
    await page.getByRole("option", { name: CLIENT_NAME }).first().click()

    // Add a line item
    await page.getByRole("button", { name: /add/i }).click()
    const descInput = page.getByPlaceholder(/description/i).first()
    await descInput.fill("E2E Test Service")
    const qtyInput = page.getByPlaceholder(/qty/i).first()
    await qtyInput.fill("2")
    const priceInput = page.getByPlaceholder(/price/i).first()
    await priceInput.fill("100")

    // Save
    await page.getByRole("button", { name: "Save Invoice" }).click()
    await page.waitForURL("**/invoice", { timeout: 15_000 })

    await expect(page.getByText(CLIENT_NAME, { exact: false })).toBeVisible()
    await expect(page.getByText(COMPANY_NAME, { exact: false })).toBeVisible()
  })

  // --- Status toggle ---

  test("status badge click toggles invoice status between paid and unpaid", async ({ page }) => {
    await page.goto("/invoice")

    const row = page.getByRole("row").filter({ hasText: CLIENT_NAME }).first()
    const badge = row.getByRole("button").filter({ hasText: /paid|unpaid/i })
    const initialText = await badge.textContent()

    await badge.click()
    await page.waitForLoadState("networkidle")

    const updatedText = await badge.textContent()
    expect(updatedText).not.toBe(initialText)

    // Toggle back
    await badge.click()
    await page.waitForLoadState("networkidle")
  })

  // --- PDF download link ---

  test("PDF download button on invoice list has correct href and download attribute", async ({ page }) => {
    await page.goto("/invoice")
    const row = page.getByRole("row").filter({ hasText: CLIENT_NAME }).first()
    // PDF download is the first link in the actions cell
    const pdfLink = row.locator("a[download]").first()
    const href = await pdfLink.getAttribute("href")
    expect(href).toMatch(/\/api\/invoice\/.+\/pdf/)
    expect(await pdfLink.getAttribute("download")).toBeDefined()
  })

  // --- Edit invoice ---

  test("edit invoice — navigates to edit page and shows Export PDF + Email Invoice buttons", async ({ page }) => {
    await page.goto("/invoice")
    const row = page.getByRole("row").filter({ hasText: CLIENT_NAME }).first()
    // Edit link is the second icon button (default/teal) in the row
    await row.getByRole("link").filter({ has: page.locator("svg") }).nth(1).click()
    await page.waitForURL("**/edit", { timeout: 10_000 })

    await expect(page.getByRole("link", { name: /export pdf/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /email invoice/i })).toBeVisible()
  })

  test("edit invoice — Export PDF link has download attribute pointing to PDF route", async ({ page }) => {
    await page.goto("/invoice")
    const row = page.getByRole("row").filter({ hasText: CLIENT_NAME }).first()
    await row.getByRole("link").filter({ has: page.locator("svg") }).nth(1).click()
    await page.waitForURL("**/edit", { timeout: 10_000 })

    const pdfLink = page.getByRole("link", { name: /export pdf/i })
    const href = await pdfLink.getAttribute("href")
    expect(href).toMatch(/\/api\/invoice\/.+\/pdf/)
    expect(await pdfLink.getAttribute("download")).toBeDefined()
  })

  test("email invoice dialog — opens and shows expected actions", async ({ page }) => {
    await page.goto("/invoice")
    const row = page.getByRole("row").filter({ hasText: CLIENT_NAME }).first()
    await row.getByRole("link").filter({ has: page.locator("svg") }).nth(1).click()
    await page.waitForURL("**/edit", { timeout: 10_000 })

    await page.getByRole("button", { name: /email invoice/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()

    // Dialog contains client name
    const dialog = page.getByRole("dialog")
    await expect(dialog.getByText(CLIENT_NAME, { exact: false })).toBeVisible()

    // Three action buttons/links
    await expect(dialog.getByRole("button", { name: /copy body/i })).toBeVisible()
    const mailLink = dialog.getByRole("link", { name: /open mail app/i })
    await expect(mailLink).toBeVisible()
    const mailHref = await mailLink.getAttribute("href")
    expect(mailHref).toMatch(/^mailto:/)

    const pdfLink = dialog.getByRole("link", { name: /download pdf/i })
    await expect(pdfLink).toBeVisible()
    expect(await pdfLink.getAttribute("href")).toMatch(/\/api\/invoice\/.+\/pdf/)
    expect(await pdfLink.getAttribute("download")).toBeDefined()
  })

  // --- Trash flow ---

  test("trash flow — trash, view in trash, restore, trash again, delete permanently", async ({ page }) => {
    await page.goto("/invoice")
    const row = page.getByRole("row").filter({ hasText: CLIENT_NAME }).first()
    const invoiceId = await row.locator("span.font-mono").textContent()

    // Trash the invoice (direct click, no dialog)
    await row.getByRole("button").last().click()
    await page.waitForLoadState("networkidle")

    // Invoice disappears from main list
    await expect(page.getByText(String(invoiceId), { exact: false })).not.toBeVisible()

    // Navigate to trash
    await page.goto("/invoice/trash")
    const card = page.locator("text=" + invoiceId?.replace("#", "")).first()
    await expect(card).toBeVisible()

    // Restore
    await page.getByRole("button").filter({ has: page.locator("svg") }).nth(0).click()
    await page.waitForLoadState("networkidle")

    // Invoice back in main list
    await page.goto("/invoice")
    await expect(page.getByText(String(invoiceId), { exact: false })).toBeVisible()

    // Trash again for permanent delete test
    const restoredRow = page.getByRole("row").filter({ hasText: CLIENT_NAME }).first()
    await restoredRow.getByRole("button").last().click()
    await page.waitForLoadState("networkidle")

    // Permanent delete
    await page.goto("/invoice/trash")
    // The delete-forever button (destructive, second icon button on the card)
    const deleteBtn = page.getByRole("button").filter({ has: page.locator("svg") }).nth(1)
    await deleteBtn.click()

    // Confirmation dialog
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: /delete permanently/i })).toBeVisible()
    await page.getByRole("button", { name: /delete forever/i }).click()
    await page.waitForLoadState("networkidle")

    // Invoice is gone from trash
    await expect(page.getByText(String(invoiceId), { exact: false })).not.toBeVisible()
  })

  // --- Invoice list search ---

  test("invoice list search filters by client or company name", async ({ page }) => {
    // Re-create an invoice to search for
    await page.goto("/invoice/new")
    const companyCombobox = page.getByRole("combobox").first()
    await companyCombobox.click()
    await companyCombobox.fill(COMPANY_NAME)
    await page.getByRole("option", { name: COMPANY_NAME }).first().click()
    const clientCombobox = page.getByRole("combobox").nth(1)
    await clientCombobox.click()
    await clientCombobox.fill(CLIENT_NAME)
    await page.getByRole("option", { name: CLIENT_NAME }).first().click()
    await page.getByRole("button", { name: "Save Invoice" }).click()
    await page.waitForURL("**/invoice", { timeout: 15_000 })

    const input = page.getByPlaceholder(/search/i)
    await input.fill(CLIENT_NAME)
    await expect(page.getByText(CLIENT_NAME, { exact: false })).toBeVisible()

    await input.fill("zzznomatch___")
    await expect(page.getByText("No results.")).toBeVisible()
  })
})
