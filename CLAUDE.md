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
```

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

| Type | When |
|------|------|
| `feat` | new feature |
| `fix` | bug fix |
| `chore` | deps, config, tooling |
| `refactor` | restructure without behaviour change |
| `docs` | documentation only |
| `style` | formatting, no logic change |

Scope is optional but recommended for domain changes: `feat(invoice):`, `fix(auth):`, `feat(ui):`.

## Environment variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Local Supabase config is in `supabase/config.toml` (site URL: `http://localhost:3000`).
