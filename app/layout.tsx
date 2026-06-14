import { Geist_Mono, Outfit, Public_Sans } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "OSInvoice",
  },
  description: "Simple invoice management",
}
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import * as React from "react"
import { NavBar } from "@/components/navigation/nav-bar"
import { createClient } from "@/utils/supabase/server"

const publicSansHeading = Public_Sans({subsets:['latin'],variable:'--font-heading'})

const outfit = Outfit({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const client = await createClient()
  const {
    data: { user },
  } = await client.auth.getUser()

  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        outfit.variable,
        publicSansHeading.variable
      )}
    >
      <body>
        <TooltipProvider>
            <SidebarProvider>
              <SidebarInset>
                <NavBar user={user} />
                <div className="h-full w-full bg-gray-50 py-4">
                  <div className="mx-auto h-full max-w-6xl px-4 md:px-6">{children}</div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
      </body>
    </html>
  )
}
