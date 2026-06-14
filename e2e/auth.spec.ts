import { test, expect } from "@playwright/test"

// These tests run unauthenticated — they cover public-facing auth pages only
test.use({ storageState: { cookies: [], origins: [] } })

test.describe("Auth pages", () => {
  test("login page renders email field and login button", async ({ page }) => {
    await page.goto("/login")
    await expect(page.locator("#email")).toBeVisible()
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible()
  })

  test("login form submission redirects to check-email page", async ({ page }) => {
    await page.goto("/login")
    await page.locator("#email").fill("test@example.com")
    await page.getByRole("button", { name: "Login" }).click()
    await page.waitForURL("**/check-email", { timeout: 10_000 })
    await expect(page).toHaveURL(/check-email/)
  })

  test("signup page renders name, surname, email fields and create account button", async ({ page }) => {
    await page.goto("/signup")
    await expect(page.locator("#name")).toBeVisible()
    await expect(page.locator("#surname")).toBeVisible()
    await expect(page.locator("#email")).toBeVisible()
    await expect(page.getByRole("button", { name: "Create Account" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible()
  })

  test("signup form submission redirects to check-email page", async ({ page }) => {
    await page.goto("/signup")
    await page.locator("#name").fill("Test")
    await page.locator("#surname").fill("User")
    await page.locator("#email").fill("newuser@example.com")
    await page.getByRole("button", { name: "Create Account" }).click()
    await page.waitForURL("**/check-email", { timeout: 10_000 })
    await expect(page).toHaveURL(/check-email/)
  })
})
