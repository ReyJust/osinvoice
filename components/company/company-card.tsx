import { Company } from "@/lib/types/company"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UpdateCompanyForm } from "@/components/company/update-company-form"

// import { DeleteCompanyForm } from "./delete-company-form"
import { formatAddress, formatDate } from "@/lib/formatters"

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Card id={"company-" + company.id.toString()}>
      <CardHeader>
        <CardTitle>{company.name}</CardTitle>
        <CardDescription>{company.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-400">
          BSB: {company.bsb} Account Number: {company.account_number}
        </p>
        <p>{formatAddress(company)}</p>
        <p className="text-xs text-gray-400">
          Created on: {formatDate(company.created_at)}
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <UpdateCompanyForm company={company} />
        {/* <DeleteCompanyForm company={company} /> */}
      </CardFooter>
    </Card>
  )
}
