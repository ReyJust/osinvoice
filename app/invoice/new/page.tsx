"use client"

import InvoiceEditor from "@/components/invoice/invoice-editor"



// ---- main page
export default function InvoiceNewPage() {
  return (
    <div className="flex min-h-screen justify-center bg-muted p-8">
      <div className="min-h-[297mm] w-[210mm] bg-white p-10 text-sm shadow-xl">
        <InvoiceEditor />
      </div>
    </div>
  )
}
