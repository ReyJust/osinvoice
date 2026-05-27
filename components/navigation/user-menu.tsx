"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon, UserIcon } from '@hugeicons/core-free-icons';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuShortcut,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

import { createClient } from '@/utils/supabase/client'
import { type User } from "@supabase/supabase-js";


export function UserMenu({ user }: { user: User }) {
    const supabase = createClient()
    const { isMobile } = useSidebar()


    const shorten_user_full_name = (name: string, surname: string) => {
        return (name[0] + surname[0]).toUpperCase()
    }

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error('Logout failed:', error.message)
            return
        }

        // optional: force redirect
        window.location.href = '/login'
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
                                {/* <AvatarImage src={user.logo_url} alt={user.user_metadata.name + user.user_metadata.surname} /> */}
                                <AvatarFallback className="rounded-lg">{shorten_user_full_name(user.user_metadata.name, user.user_metadata.surname)}</AvatarFallback>
                            </Avatar>

                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="lowercase text-white">{user.email}</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-2 p-2">
                                <HugeiconsIcon
                                    icon={UserIcon}
                                // size={24}
                                // color="#99A1AF"
                                // strokeWidth={1.5}
                                />Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 p-2" onClick={handleLogout}>
                                <HugeiconsIcon
                                    icon={Logout01Icon}
                                // size={24}
                                // color="#99A1AF"
                                // strokeWidth={1.5}
                                />Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
