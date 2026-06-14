"use client"

import { NavMenu } from "@/components/navigation/nav-menu"
import { UserMenu } from "@/components/navigation/user-menu"
import Link from "next/link"

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

import { type User } from "@supabase/supabase-js"
import CreateInvoiceButton from "../invoice/create-invoice-button"

const NAV_ITEMS = [
  { name: "Invoices", href: "/invoice" },
  { name: "Clients", href: "/client" },
  { name: "Companies", href: "/company" },
]

export function NavBar({ user }: { user: User | null }) {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)

  function navigate(href: string) {
    setSheetOpen(false)
    router.push(href)
  }

  return (
    <header className="grid grid-cols-2 md:grid-cols-3 h-16 shrink-0 items-center border-b px-4">
      {/* Left: user menu or login link */}
      <div>
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Tooltip>
            <TooltipTrigger>
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

      {/* Desktop: centre nav */}
      <div className="hidden md:flex justify-center">
        {user ? <NavMenu /> : null}
      </div>

      {/* Desktop: create button */}
      <div className="hidden md:flex justify-end">
        <CreateInvoiceButton />
      </div>

      {/* Mobile: hamburger */}
      <div className="flex md:hidden justify-end">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={Menu01Icon} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 pt-10">
            <nav className="flex flex-col gap-1 px-4">
              {user &&
                NAV_ITEMS.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="justify-start"
                    onClick={() => navigate(item.href)}
                  >
                    {item.name}
                  </Button>
                ))}
              <div className="pt-2 border-t mt-2">
                <Button
                  className="w-full"
                  onClick={() => navigate("/invoice/new")}
                >
                  New Invoice
                  <HugeiconsIcon icon={PlusSignIcon} />
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
