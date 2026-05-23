import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from '@hugeicons/core-free-icons';

import { Button } from "@/components/ui/button"

import {
    NavMenu,
} from "@/components/navigation/nav-menu"
import { UserMenu } from "@/components/navigation/user-menu";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

// Types
// import { type User } from "@/lib/types/user";

export async function NavBar() {

    const cookieStore = await cookies()
    const client = createClient(cookieStore)
    const { data: { user } } = await client.auth.getUser()

    return (
        <header className="flex h-16 shrink-0 justify-between items-center gap-2 border-b px-4">
            <div >
                {user ? <UserMenu user={user} /> : <Tooltip>
                    <TooltipTrigger>
                        {/* <Button size="sm" onClick={() => router.push('/signup')}>
                            Sign Up / Login
                        </Button> */}
                        <Link href="/login" className="text-sm font-medium">
                            Sign Up / Login
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>By signing up, you will be able to save invoices and all informations for fast usage.</p>
                    </TooltipContent>
                </Tooltip>}
            </div>
            {user ? <NavMenu /> : null}

            <Button size="sm">
                New Invoice
                <HugeiconsIcon
                    icon={PlusSignIcon}
                // size={24}
                // color="currentColor"
                // strokeWidth={1.5}
                />
            </Button>

        </header>

    )
}