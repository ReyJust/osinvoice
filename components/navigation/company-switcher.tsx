"use client"

import {
    UnfoldMoreIcon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button"
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import * as React from "react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
// Types
import { type company } from "@/lib/types/navigation";

export function CompanySwitcher({
    companies: companies,
    current_company: company,
}: {
    companies: company[],
    current_company: company
}) {
    const { isMobile } = useSidebar()

    const [activeCompany, setActiveCompany] = React.useState(companies[0])

    const shorten_company_name = (company_name: string) => {

        const parts = company_name.trim().split(" ")

        // If there is a space -> take first char of first two words
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase()
        }

        // If no space -> take first 2 characters
        return company_name.slice(0, 2).toUpperCase()
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={company.logo} alt={company.name} />
                                <AvatarFallback className="rounded-lg">{shorten_company_name(company.name)}</AvatarFallback>
                            </Avatar>

                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Companies
                        </DropdownMenuLabel>
                        {companies.map((company, index) => (
                            <DropdownMenuItem
                                key={company.name}
                                onClick={() => setActiveCompany(company)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={company.logo} alt={company.name} />
                                        <AvatarFallback className="rounded-lg">{shorten_company_name(company.name)}</AvatarFallback>
                                    </Avatar>                                </div>
                                {company.name}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">

                                <HugeiconsIcon
                                    icon={PlusSignIcon}
                                // size={24}
                                // color="currentColor"
                                // strokeWidth={1.5}
                                />                            </div>
                            <div className="font-medium text-muted-foreground">Add company</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
