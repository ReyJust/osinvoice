"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Trash } from "@hugeicons/core-free-icons"

export default async function Page() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      size="icon"
      className="cursor-pointer"
      onClick={() => router.push("/invoice/trash")}
    >
      <HugeiconsIcon icon={Trash} />
    </Button>
  )
}
