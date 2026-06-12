// import { Invoice } from "@/lib/types/invoice"
// import { InvoiceCard } from "@/components/invoice/invoice-card"
// import {
//   Empty,
//   EmptyContent,
//   EmptyDescription,
//   EmptyHeader,
//   EmptyMedia,
//   EmptyTitle,
// } from "@/components/ui/empty"
// import { HugeiconsIcon } from "@hugeicons/react"
// import {
//   LegalDocument02Icon,
//   Search01Icon,
//   Trash,
// } from "@hugeicons/core-free-icons"
// import { Button } from "@/components/ui/button"
// import { ButtonGroup } from "@/components/ui/button-group"
// import { Field } from "@/components/ui/field"
// import { Input } from "@/components/ui/input"
// import CreateInvoiceButton from "@/components/invoice/create-invoice-button"
// import { getTrashedInvoices } from "@/lib/invoices"
// import BackButton from "@/components/back-button"

// export default async function Page() {
//   const invoices: Invoice[] = await getTrashedInvoices()
// //   const client: Invoice[] = await getTrashedInvoices()
// //   const companies: Invoice[] = await getTrashedInvoices()

//   return (
//     <div className="">
//       <div className="flex align-center gap-2">
//         <BackButton />
//         <h1 className="pb-4 text-2xl font-bold">Trashed Items</h1>
//       </div>
//       {invoices.length == 0 ? (
//         <Empty>
//           <EmptyHeader>
//             <EmptyMedia variant="icon">
//               <HugeiconsIcon
//                 icon={LegalDocument02Icon}
//                 // className="text-muted-foreground"
//                 // size={24}
//                 // color="#FFFFFF"
//                 // strokeWidth={1.5}
//               />
//             </EmptyMedia>
//             <EmptyTitle>No Trashed Invoices Yet</EmptyTitle>
//             <EmptyDescription>
//               You haven&apos;t trashed invoices yet.
//             </EmptyDescription>
//           </EmptyHeader>
//           <EmptyContent className="flex-row justify-center gap-2">
//             <CreateInvoiceButton />
//           </EmptyContent>
//         </Empty>
//       ) : (
//         <div className="flex flex-col gap-4">
//           <div className="flex flex-1 flex-col gap-4">
//             <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//               {items.map((item) => {
//                 return <TrashItemCard key={item.id} item={item} />
//               })}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
