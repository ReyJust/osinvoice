"use client"

import { Invoice } from "@/lib/types/invoice"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit03Icon,
  Money03Icon,
  MoneyNotFound03Icon,
} from "@hugeicons/core-free-icons"

import { DeleteInvoiceForm } from "./delete-invoice-form"
import { formatDate } from "@/lib/formatters"
import { changeInvoiceStatus } from "@/app/invoice/actions"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const invoiceStatuses = {
    paid: {
      next: "unpaid",
      actionStyle: "destructive", // clicking will UNPAY → red action
      actionIcon: MoneyNotFound03Icon,
      actionLabel: "Mark as unpaid",
    },
    unpaid: {
      next: "paid",
      actionStyle: "primary", // clicking will PAY → green action
      actionIcon: Money03Icon,
      actionLabel: "Mark as paid",
    },
  } as const

  const status = invoiceStatuses[invoice.status]

  return (
    <Card
      id={"invoice-" + invoice.id.toString()}
      className={`bg-${invoiceStatuses[status.next].actionStyle}/10`}
    >
      <CardHeader>
        <CardTitle>#{invoice.id}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        {/* TODO: currency setting */}
        <div>
          <h3 className="uppercase">{invoice.company?.name}</h3>
          <h4 className="uppercase">{invoice.client?.name}</h4>
          <div className="my-2 flex items-center gap-2">
            <div>
              <h3 className="text-xl font-bold text-black">
                $
                {invoice.lines
                  .reduce((sum, line) => sum + line.totalAmount, 0)
                  .toFixed(2)}
              </h3>
              <p>
                {invoice.status.charAt(0).toUpperCase() +
                  invoice.status.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <div>
          <p className="text-xs text-gray-400">
            Created on: {formatDate(invoice.created_at)}
          </p>
        </div>
        <div className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={status.actionStyle as any}
                size="icon"
                onClick={() => changeInvoiceStatus(invoice.id, status.next)}
              >
                <HugeiconsIcon icon={status.actionIcon} />
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              <p>Mark as {invoice.status === "paid" ? "Unpaid" : "Paid"}</p>
            </TooltipContent>
          </Tooltip>

          <Button variant="default" size="icon">
            <HugeiconsIcon icon={Edit03Icon} />
          </Button>
          <DeleteInvoiceForm invoice={invoice} />
        </div>
      </CardFooter>
    </Card>
  )
}
