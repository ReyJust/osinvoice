export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer"
import React from "react"
import { createClient } from "@/utils/supabase/server"
import { getInvoice } from "@/lib/invoices"
import { InvoicePDFDocument } from "@/components/invoice/invoice-pdf"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  let invoice
  try {
    invoice = await getInvoice(id)
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const buffer = await renderToBuffer(
    React.createElement(
      InvoicePDFDocument,
      { invoice }
    ) as React.ReactElement<DocumentProps>
  )

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${id}.pdf"`,
    },
  })
}
