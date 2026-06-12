"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft } from "@hugeicons/core-free-icons"

export default async function Page() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      onClick={() => router.back()}
    >
      <HugeiconsIcon icon={ArrowLeft} />
    </Button>
  )
}
