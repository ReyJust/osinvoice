"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"

export const SearchSection = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const initialQuery = searchParams.get("search") ?? ""
  const [query, setQuery] = useState(initialQuery)

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }

    const qs = params.toString()
    const url = qs ? `${pathname}?${qs}` : pathname

    router.push(url, { scroll: false })
  }

  // debounce (2s after typing stops)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== initialQuery) {
        updateSearch(query)
      }
    }, 1200)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <Field className="max-w-1/2 bg-white">
      <ButtonGroup>
        <Input
          id="input-button-group"
          placeholder="Type to search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => updateSearch(query)}
        />

        <Button
          variant="default"
          size="icon"
          onClick={() => updateSearch(query)}
        >
          <HugeiconsIcon icon={Search01Icon} />
        </Button>
      </ButtonGroup>
    </Field>
  )
}
