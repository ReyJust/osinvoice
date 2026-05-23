import { Invoice } from "@/lib/types/invoice"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function InvoiceCard({ invoice
}: {
    invoice: Invoice
}) {
    return (
        <Card id={invoice.id}>
            <CardHeader>
                {/* <CardTitle>{invoice.title}</CardTitle> */}
                {/* <CardDescription>{invoice.description}</CardDescription> */}
                {/* <CardAction>{invoice.action}</CardAction> */}
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}