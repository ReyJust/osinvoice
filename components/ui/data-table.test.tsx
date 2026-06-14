import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table"

type Row = { id: number; name: string; city: string }

const columns: ColumnDef<Row>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "city", header: "City" },
]

const data: Row[] = [
  { id: 1, name: "Alice", city: "Melbourne" },
  { id: 2, name: "Bob", city: "Sydney" },
  { id: 3, name: "Carol", city: "Brisbane" },
]

describe("DataTable", () => {
  it("renders all rows from data", () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
    expect(screen.getByText("Carol")).toBeInTheDocument()
  })

  it("renders all column headers", () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText("ID")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("City")).toBeInTheDocument()
  })

  it("shows 'No results.' when data is empty", () => {
    render(<DataTable columns={columns} data={[]} />)
    expect(screen.getByText("No results.")).toBeInTheDocument()
  })

  it("shows correct result count", () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText("3 results")).toBeInTheDocument()
  })

  it("shows '1 result' (singular) for one row", () => {
    render(<DataTable columns={columns} data={[data[0]]} />)
    expect(screen.getByText("1 result")).toBeInTheDocument()
  })

  it("shows '0 results' for empty data", () => {
    render(<DataTable columns={columns} data={[]} />)
    expect(screen.getByText("0 results")).toBeInTheDocument()
  })

  it("renders the search input with custom placeholder", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Search by name…"
      />
    )
    expect(
      screen.getByPlaceholderText("Search by name…")
    ).toBeInTheDocument()
  })

  it("uses default placeholder when none provided", () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByPlaceholderText("Search…")).toBeInTheDocument()
  })

  it("filters rows when search term is typed", async () => {
    render(<DataTable columns={columns} data={data} />)
    const input = screen.getByPlaceholderText("Search…")
    await userEvent.type(input, "alice")
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.queryByText("Bob")).not.toBeInTheDocument()
    expect(screen.queryByText("Carol")).not.toBeInTheDocument()
  })

  it("shows 'No results.' when search matches nothing", async () => {
    render(<DataTable columns={columns} data={data} />)
    const input = screen.getByPlaceholderText("Search…")
    await userEvent.type(input, "zzznomatch")
    expect(screen.getByText("No results.")).toBeInTheDocument()
  })

  it("updates result count after filtering", async () => {
    render(<DataTable columns={columns} data={data} />)
    const input = screen.getByPlaceholderText("Search…")
    await userEvent.type(input, "melbourne")
    expect(screen.getByText("1 result")).toBeInTheDocument()
  })

  it("is case-insensitive in search", async () => {
    render(<DataTable columns={columns} data={data} />)
    const input = screen.getByPlaceholderText("Search…")
    await userEvent.type(input, "ALICE")
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.queryByText("Bob")).not.toBeInTheDocument()
  })
})
