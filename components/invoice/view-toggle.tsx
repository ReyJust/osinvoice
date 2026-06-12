"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar01Icon, ListViewIcon } from "@hugeicons/core-free-icons"

export function ViewToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const view = searchParams.get("view") ?? "list"

  const setView = (newView: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("view", newView)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <ButtonGroup>
      <Button
        variant={view === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => setView("list")}
      >
        <HugeiconsIcon icon={ListViewIcon} />
      </Button>
      <Button
        variant={view === "calendar" ? "default" : "outline"}
        size="icon"
        onClick={() => setView("calendar")}
      >
        <HugeiconsIcon icon={Calendar01Icon} />
      </Button>
    </ButtonGroup>
  )
}
