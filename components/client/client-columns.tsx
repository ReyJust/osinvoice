"use client"

import { ColumnDef } from "@tanstack/react-table"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpDownIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Client } from "@/lib/types/client"
import { UpdateClientForm } from "./update-client-form"
// import { DeleteClientForm } from "./delete-client-form"

function SortableHeader({ label, column }: { label: string; column: any }) {
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

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader label="Name" column={column} />,
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader label="Email" column={column} />,
  },
  {
    id: "location",
    accessorFn: (row) => `${row.city}, ${row.state}`,
    header: ({ column }) => <SortableHeader label="Location" column={column} />,
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "country",
    header: ({ column }) => <SortableHeader label="Country" column={column} />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <UpdateClientForm client={row.original} />
        {/* <DeleteClientForm client={row.original} /> */}
      </div>
    ),
  },
]
