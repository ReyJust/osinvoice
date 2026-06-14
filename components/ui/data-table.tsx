"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholder?: string
  defaultSort?: SortingState
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search…",
  defaultSort = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(defaultSort)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, globalFilter },
  })

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder={searchPlaceholder}
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        {table.getFilteredRowModel().rows.length} result
        {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
      </p>
    </div>
  )
}
