import { Invoice } from "@/lib/types/invoice"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "../ui/button"
import { HugeiconsIcon } from "@hugeicons/react"

import { DeleteInvoiceForm } from "./delete-invoice-form"
import { formatDate } from "@/lib/formatters"
import { Edit03Icon } from "@hugeicons/core-free-icons"

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  return (
    <Card id={"invoice-" + invoice.id.toString()}>
      <CardHeader>
        <CardTitle>#{invoice.id}</CardTitle>
        <CardDescription>
          {`${invoice.description} ${invoice.company_id}`}
          {/* TODO: Use company name */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{invoice.status}</p> {/* TODO: Colorize status */}
        <p className="text-xs text-gray-400">
          Created on: {formatDate(invoice.created_at)}
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="default" size="icon">
          <HugeiconsIcon
            icon={Edit03Icon}
            // className="text-muted-foreground"
            // size={24}
            // color="#FFFFFF"
            // strokeWidth={1.5}
          />
        </Button>
        <DeleteInvoiceForm invoice={invoice} />
      </CardFooter>
    </Card>
  )
}
