import { Geist, Geist_Mono, Outfit, Public_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import * as React from "react"
import { NavBar } from "@/components/navigation/nav-bar"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

const publicSansHeading = Public_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
})

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const client = createClient(cookieStore)
  const {
    data: { user },
  } = await client.auth.getUser()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        outfit.variable,
        publicSansHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <SidebarProvider>
              <SidebarInset>
                <NavBar user={user} />
                <div className="h-full w-full bg-gray-50 py-4">
                  <div className="mx-auto h-full max-w-6xl">{children}</div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
