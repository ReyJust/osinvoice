"use client"

import { ColumnDef } from "@tanstack/react-table"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowUpDownIcon,
  Delete02Icon,
  Download01Icon,
  Edit03Icon,
} from "@hugeicons/core-free-icons"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Invoice } from "@/lib/types/invoice"
import { formatDate } from "@/lib/formatters"
import { changeInvoiceStatus, moveInvoiceToTrash } from "@/app/invoice/actions"

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

export const invoiceColumns: ColumnDef<Invoice>[] = [
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
    header: ({ column }) => <SortableHeader label="Company" column={column} />,
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
      const invoice = row.original
      const isPaid = invoice.status === "paid"
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() =>
                changeInvoiceStatus(invoice.id, isPaid ? "unpaid" : "paid")
              }
              className="cursor-pointer"
            >
              <Badge variant={isPaid ? "default" : "outline"}>
                {isPaid ? "Paid" : "Unpaid"}
              </Badge>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Mark as {isPaid ? "Unpaid" : "Paid"}
          </TooltipContent>
        </Tooltip>
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
    cell: ({ row }) => {
      const invoice = row.original
      return (
        <div className="flex items-center justify-end gap-1">
          <Button variant="outline" size="icon" asChild>
            <a href={`/api/invoice/${invoice.id}/pdf`} download>
              <HugeiconsIcon icon={Download01Icon} />
            </a>
          </Button>
          <Button variant="default" size="icon" asChild>
            <Link href={`/invoice/${invoice.id}/edit`}>
              <HugeiconsIcon icon={Edit03Icon} />
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => moveInvoiceToTrash(invoice.id)}
          >
            <HugeiconsIcon icon={Delete02Icon} />
          </Button>
        </div>
      )
    },
  },
]
