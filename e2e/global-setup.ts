import { chromium } from "@playwright/test"
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

export default async function globalSetup() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const testEmail = process.env.E2E_TEST_EMAIL

  if (!supabaseUrl || !serviceRoleKey || !testEmail) {
    throw new Error(
      "E2E setup requires NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and E2E_TEST_EMAIL in .env.local"
    )
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: testEmail,
    options: {
      // Must go through /auth/callback so the code is exchanged for a session
      // before the app tries to render any auth-protected page.
      redirectTo: "http://localhost:3000/auth/callback",
    },
  })

  if (error || !data?.properties?.action_link) {
    throw new Error(`Failed to generate magic link: ${error?.message ?? "no action_link returned"}`)
  }

  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto(data.properties.action_link)
  await page.waitForURL("**/invoice/new", { timeout: 15_000 })

  await page.context().storageState({ path: "e2e/storageState.json" })
  await browser.close()

  console.log(`✓ E2E auth session saved for ${testEmail}`)
}
