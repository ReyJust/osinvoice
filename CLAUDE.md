# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint
npm run format       # Prettier (formats all .ts/.tsx files)
npm run typecheck    # TypeScript type check (no emit)
npm run db_types     # Regenerate Supabase types from local DB → lib/types/database.types.ts
npx supabase start   # Start Supabase in local
npm run test         # Run tests in watch mode (Vitest)
npm run test:run     # Run all tests once (CI / single pass)
npm run e2e          # Run Playwright E2E tests (requires local Supabase + dev server)
npm run e2e:ui       # Open Playwright interactive UI
npm run e2e:debug    # Run E2E in debug/step mode
```

## Testing

**Framework**: Vitest 4 + @testing-library/react + jsdom.

Test files live next to the code they test (`*.test.ts` / `*.test.tsx`), except for test infrastructure which is in `tests/`:
- `tests/setup.ts` — imports `@testing-library/jest-dom` matchers globally
- `vitest.config.ts` — configures jsdom environment, React plugin, and `@` path alias

**Coverage areas**:
| File(s) | What's tested |
|---------|---------------|
| `lib/formatters/formatDate.test.ts` | Date formatting edge cases |
| `lib/formatters/formatAddress.test.ts` | Address joining and country flag |
| `lib/invoices.test.ts` | `groupInvoicesByMonth` grouping and sort order |
| `components/ui/data-table.test.tsx` | Rendering, search filtering, result count |
| `components/invoice/invoice-email-dialog.test.tsx` | Dialog open/close, email body content, mailto href, clipboard, PDF link |
| `app/invoice/actions.test.ts` | All server actions — Supabase calls, user scoping, error propagation, auth guard |
| `app/client/actions.test.ts` | createClient, updateClient, deleteClient — fields, scoping, errors, unauth guard |
| `app/company/actions.test.ts` | createCompany, updateCompany, deleteCompany — fields, scoping, errors, unauth guard |

## E2E Testing

**Framework**: Playwright + Chromium. Tests live in `e2e/`.

**Auth setup**: The app uses magic link only. `e2e/global-setup.ts` uses the Supabase Admin API to generate a magic link URL directly, navigates to it headlessly, and saves the session to `e2e/storageState.json` (gitignored). All E2E tests reuse that session via `storageState` in `playwright.config.ts`.

**Required env vars** (add to `.env.local`):
- `SUPABASE_SERVICE_ROLE_KEY` — from `npx supabase status`
- `E2E_TEST_EMAIL` — email for the test user (e.g. `e2e@test.local`)

**Test files**:
| File | Coverage |
|------|----------|
| `e2e/auth.spec.ts` | Login/signup pages, form submission → check-email redirect (unauthenticated) |
| `e2e/companies.spec.ts` | Create, search, update, delete company |
| `e2e/clients.spec.ts` | Create, search, update, delete client |
| `e2e/invoices.spec.ts` | Create invoice, status toggle, PDF link, email dialog, trash/restore/permanent delete, search |

**Mocking Supabase in server action tests**: the client object returned by `createClient()` must NOT be thenable. If it has a `.then` method, `await createClient()` will unwrap it via the Promises/A+ spec and yield the query result instead of the client. Keep the client and query chain as separate objects in `makeBuilder()`.

**Auth mock shape differs by action file**:
- `app/invoice/actions.ts` uses `requireUser()` → mock `@/utils/supabase/require-user`
- `app/client/actions.ts` and `app/company/actions.ts` use `supabase.auth.getUser()` directly → add `auth: { getUser: vi.fn().mockResolvedValue(...) }` to the client mock instead

## Architecture

**Stack**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Supabase (auth + Postgres), shadcn/ui components.

**App purpose**: Invoice management — users manage their companies, clients, and invoices.

### Data layer

Three core tables: `clients`, `companies`, `invoices`. All support soft-delete via a `deleted: boolean` column. The `invoice_search` Postgres view joins invoices with their client and company for search/display.

Type definitions live in `lib/types/` and are derived from `lib/types/database.types.ts` (auto-generated via `npm run db_types`). Domain types (`Invoice`, `Client`, `Company`) are defined in separate files that import the generated DB types.

Data fetching functions are in `lib/clients.ts`, `lib/companies.ts`, `lib/invoices.ts` — these are called from Server Components (page files).

### Server Actions

Mutations are in `app/*/actions.ts` files, marked `"use server"`. They always:
1. Call `requireUser()` from `utils/supabase/require-user.ts` — throws `Error("Unauthorized")` if no session
2. Scope all DB queries with `.eq("user_id", user.id)`
3. Call `revalidatePath()` after mutations

### Supabase clients

- **Server** (`utils/supabase/server.ts`): `createClient()` — async, uses Next.js cookies. Used in Server Components and Server Actions.
- **Client** (`utils/supabase/client.ts`): `useSupabase()` hook — creates a browser client, used in Client Components only.

### Auth flow

Email magic link / OAuth via Supabase. The OAuth callback is at `app/auth/callback/route.ts`, which exchanges the code for a session and redirects to `/invoice/new`.

### Invoice IDs

Generated client-side in `InvoiceEditor` with format `INV-{YYYYMMDD}-{6 random base-36 chars}`.

### UI patterns

- Icons: `@hugeicons/react` + `@hugeicons/core-free-icons` — always use `<HugeiconsIcon icon={...} />`
- Forms: `react-hook-form` + `zod` for validation
- `components/ui/` contains shadcn/ui primitives (Button, Card, Dialog, Combobox, etc.)
- Layout wraps pages in `SidebarProvider` → `SidebarInset` → `NavBar` + content area (max-w-6xl, centered)
- Trash/restore flow: soft-delete sets `deleted: true`; `/invoice/trash` shows and manages deleted invoices

## Commit conventions

Use [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <message>`

Do not add `Co-Authored-By` trailers to commits.

| Type | When |
|------|------|
| `feat` | new feature |
| `fix` | bug fix |
| `chore` | deps, config, tooling |
| `refactor` | restructure without behaviour change |
| `docs` | documentation only |
| `style` | formatting, no logic change |

Scope is optional but recommended for domain changes: `feat(invoice):`, `fix(auth):`, `feat(ui):`.
DO NOT commit automatically unless I ask you to.

## Environment variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Local Supabase config is in `supabase/config.toml` (site URL: `http://localhost:3000`).
