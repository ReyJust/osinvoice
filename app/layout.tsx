import { Geist, Geist_Mono, Outfit, Public_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import * as React from "react"
import { NavBar } from "@/components/navigation/nav-bar";

// Types
import { company } from "@/lib/types/navigation";

const publicSansHeading = Public_Sans({ subsets: ['latin'], variable: '--font-heading' });

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const companies: company[] = [{
  name: "Acme Pty LTD",
  logo: '',
  contact_details: {
    adress_line: "123 Main Street",
    city: "Sydney",
    postal_code: "2000",
    country: "Australia"
  },
  payment_details: {
    bsb: "123-456",
    account_number: "12345678"
  }
},
{
  name: "Yo-Chi Pty LTD",
  logo: '',
  contact_details: {
    adress_line: "123 Main Street",
    city: "Sydney",
    postal_code: "2000",
    country: "Australia"
  },
  payment_details: {
    bsb: "123-456",
    account_number: "12345678"
  }
}
]

const current_company = companies[0];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", outfit.variable, publicSansHeading.variable)}
    >
      <body>
        <ThemeProvider><TooltipProvider><SidebarProvider>
          <SidebarInset>
            <NavBar companies={companies} current_company={current_company} />
            {children}
          </SidebarInset>
        </SidebarProvider></TooltipProvider></ThemeProvider>
      </body>
    </html>
  )
}


