"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArchiveRestoreIcon,
  ArrowUpDownIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Invoice } from "@/lib/types/invoice"
import { formatDate } from "@/lib/formatters"
import {
  deleteInvoicePermanently,
  restoreInvoiceFromTrash,
} from "@/app/invoice/actions"

function SortableHeader({
  label,
  column,
}: {
  label: string
  column: any
}) {
  return (
    <Button
      variant="ghost"
      className="-ml-3 h-8"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <HugeiconsIcon icon={ArrowUpDownIcon} className="ml-1 h-3 w-3" />
    </Button>
  )
}

function TrashActions({ invoice }: { invoice: Invoice }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center justify-end gap-1">
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
              This will permanently delete {invoice.id}. This cannot be undone.
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
  )
}

export const trashInvoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeader label="Invoice" column={column} />,
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        #{row.getValue("id")}
      </span>
    ),
  },
  {
    id: "client",
    accessorFn: (row) => row.client?.name ?? "—",
    header: ({ column }) => <SortableHeader label="Client" column={column} />,
    cell: ({ getValue }) => (
      <span className="uppercase">{getValue() as string}</span>
    ),
  },
  {
    id: "company",
    accessorFn: (row) => row.company?.name ?? "—",
    header: ({ column }) => (
      <SortableHeader label="Company" column={column} />
    ),
    cell: ({ getValue }) => (
      <span className="uppercase">{getValue() as string}</span>
    ),
  },
  {
    id: "total",
    accessorFn: (row) =>
      row.lines.reduce((sum, line) => sum + line.totalAmount, 0),
    header: ({ column }) => <SortableHeader label="Amount" column={column} />,
    cell: ({ getValue }) => (
      <span className="font-semibold">
        ${(getValue() as number).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader label="Status" column={column} />,
    cell: ({ row }) => {
      const isPaid = row.original.status === "paid"
      return (
        <Badge variant={isPaid ? "default" : "outline"}>
          {isPaid ? "Paid" : "Unpaid"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortableHeader label="Date" column={column} />,
    cell: ({ row }) => formatDate(row.getValue("date")),
  },
  {
    id: "actions",
    cell: ({ row }) => <TrashActions invoice={row.original} />,
  },
]
