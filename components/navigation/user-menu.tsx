"use client"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Logout01Icon, Settings01Icon, Trash } from "@hugeicons/core-free-icons"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { useSupabase } from "@/utils/supabase/client"
import { type User } from "@supabase/supabase-js"

export function UserMenu({ user }: { user: User }) {
  const router = useRouter()
  const supabase = useSupabase()

  const initials = (name?: string, surname?: string) =>
    ((name?.[0] ?? "") + (surname?.[0] ?? "")).toUpperCase() || "?"

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Logout failed:", error.message)
      return
    }
    window.location.href = "/login"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-auto justify-start gap-2 px-2 data-[state=open]:bg-accent"
        >
          <Avatar className="h-7 w-7 rounded-lg">
            <AvatarFallback className="rounded-lg text-xs">
              {initials(
                user.user_metadata?.name,
                user.user_metadata?.surname
              )}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-sm">{user.user_metadata?.name ?? user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="lowercase font-normal text-muted-foreground">
            {user.email}
          </DropdownMenuLabel>
          <DropdownMenuItem className="gap-2 p-2 cursor-pointer" onClick={() => router.push("/settings")}>
            <HugeiconsIcon icon={Settings01Icon} />
            Settings
          </DropdownMenuItem>
<DropdownMenuItem className="gap-2 p-2 cursor-pointer" onClick={() => router.push("/trash")}>
            <HugeiconsIcon icon={Trash} />
            Trash
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 p-2 cursor-pointer" onClick={handleLogout}>
            <HugeiconsIcon icon={Logout01Icon} />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
