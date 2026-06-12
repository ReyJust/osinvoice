"use client"

import { NavMenu } from "@/components/navigation/nav-menu"
import { UserMenu } from "@/components/navigation/user-menu"
import Link from "next/link"

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { useRouter } from "next/navigation"

// Types
import { type User } from "@supabase/supabase-js"
import CreateInvoiceButton from "../invoice/create-invoice-button"

export function NavBar({ user }: { user: User | null }) {
  const router = useRouter()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div>
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Tooltip>
            <TooltipTrigger>
              {/* <Button size="sm" onClick={() => router.push('/signup')}>
                            Sign Up / Login
                        </Button> */}
              <Link href="/login" className="text-sm font-medium">
                Sign Up / Login
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                By signing up, you will be able to save invoices and all
                informations for fast usage.
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {user ? <NavMenu /> : null}

      <CreateInvoiceButton />
    </header>
  )
}
