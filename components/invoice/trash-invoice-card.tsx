"use client"

import { Invoice } from "@/lib/types/invoice"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArchiveRestoreIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import {
  deleteInvoicePermanently,
  restoreInvoiceFromTrash,
} from "@/app/invoice/actions"
import { formatDate } from "@/lib/formatters"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TrashInvoiceCard({ invoice }: { invoice: Invoice }) {
  const [open, setOpen] = useState(false)

  const total = invoice.lines
    .reduce((sum, line) => sum + line.totalAmount, 0)
    .toFixed(2)

  return (
    <Card className="opacity-75">
      <CardHeader>
        <CardTitle className="text-muted-foreground">#{invoice.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="uppercase">{invoice.company?.name}</h3>
        <h4 className="uppercase">{invoice.client?.name}</h4>
        <div className="my-2">
          <p className="text-xl font-bold">${total}</p>
          <p className="text-sm text-muted-foreground">
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </p>
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <p className="text-xs text-gray-400">
          Created on: {formatDate(invoice.created_at)}
        </p>

        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="icon"
                onClick={() => restoreInvoiceFromTrash(invoice.id)}
              >
                <HugeiconsIcon icon={ArchiveRestoreIcon} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Restore invoice</TooltipContent>
          </Tooltip>

          <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <HugeiconsIcon icon={Delete02Icon} />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Delete permanently</TooltipContent>
            </Tooltip>

            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Delete permanently?</DialogTitle>
                <DialogDescription>
                  This will permanently delete {invoice.id}. This cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-2">
                <DialogClose asChild>
                  <Button className="flex-1" variant="default">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  className="flex-1"
                  variant="destructive"
                  onClick={async () => {
                    await deleteInvoicePermanently(invoice.id)
                    setOpen(false)
                  }}
                >
                  Delete forever
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  )
}
