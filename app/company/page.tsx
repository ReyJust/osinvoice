import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserDollarIcon } from "@hugeicons/core-free-icons"
import { CreateCompanyForm } from "@/components/company/create-company-form"
import { getCompanies } from "@/lib/companies"
import { DataTable } from "@/components/ui/data-table"
import { companyColumns } from "@/components/company/company-columns"

export default async function Page() {
  const companies = await getCompanies()

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-bold">Companies</h1>
        <CreateCompanyForm />
      </div>

      {companies.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={UserDollarIcon} />
            </EmptyMedia>
            <EmptyTitle>No Companies Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any companies yet. Get started by
              creating your first company.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <CreateCompanyForm />
          </EmptyContent>
        </Empty>
      ) : (
        <DataTable
          columns={companyColumns}
          data={companies}
          searchPlaceholder="Search by name, email or location…"
          defaultSort={[{ id: "name", desc: false }]}
        />
      )}
    </div>
  )
}
