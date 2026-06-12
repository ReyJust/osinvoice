"use client"

import { useMemo } from "react"
import type { DayButton } from "react-day-picker"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Invoice } from "@/lib/types/invoice"

type DotInfo = { hasUnpaid: boolean; hasPaid: boolean }

function buildInvoiceMap(invoices: Invoice[]): Map<string, DotInfo> {
  const map = new Map<string, DotInfo>()
  for (const invoice of invoices) {
    const key = invoice.date.slice(0, 10)
    const current = map.get(key) ?? { hasUnpaid: false, hasPaid: false }
    map.set(key, {
      hasUnpaid: current.hasUnpaid || invoice.status === "unpaid",
      hasPaid: current.hasPaid || invoice.status === "paid",
    })
  }
  return map
}

export function InvoiceCalendar({ invoices }: { invoices: Invoice[] }) {
  const invoiceMap = useMemo(() => buildInvoiceMap(invoices), [invoices])

  // Defined via useMemo so the component reference is stable across re-renders
  // as long as invoiceMap doesn't change, avoiding unnecessary Calendar remounts.
  const DayButtonWithDots = useMemo(
    () =>
      function DayButtonWithDots(props: React.ComponentProps<typeof DayButton>) {
        const d = props.day.date
        const pad = (n: number) => String(n).padStart(2, "0")
        const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
        const info = invoiceMap.get(key)

        return (
          <CalendarDayButton
            {...props}
            className={cn("aspect-auto h-auto", props.className)}
          >
            {props.children}
            {info && (
              <span className="flex justify-center gap-0.5 pb-1">
                {info.hasUnpaid && (
                  <span className="size-1.5 rounded-full bg-amber-400" />
                )}
                {info.hasPaid && (
                  <span className="size-1.5 rounded-full bg-green-500" />
                )}
              </span>
            )}
          </CalendarDayButton>
        )
      },
    [invoiceMap]
  )

  return (
    <Card className="p-4">
      <Calendar
        components={{ DayButton: DayButtonWithDots }}
        className="w-full [--cell-size:--spacing(12)]"
        classNames={{
          root: "w-full",
          months: "flex w-full flex-col",
          month: "w-full",
          weekdays: "flex w-full",
          weekday: "flex-1 text-center",
          week: "mt-2 flex w-full",
          day: "group/day relative flex-1 p-0 text-center select-none",
        }}
      />
    </Card>
  )
}
