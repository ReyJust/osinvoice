"use client"

import { Button } from "@/components/ui/button"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push("/invoice/new")}
      className="cursor-pointer"
    >
      New Invoice
      <HugeiconsIcon
        icon={PlusSignIcon}
        // size={24}
        // color="currentColor"
        // strokeWidth={1.5}
      />
    </Button>
  )
}
