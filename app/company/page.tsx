"use server"
// import { IconFolderCode } from "@tabler/icons-react"
// import { ArrowUpRightIcon } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

// import { Kbd } from "@/components/ui/kbd"

import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, UserDollarIcon } from "@hugeicons/core-free-icons"

import { CompanyCard } from "@/components/company/company-card"
import { CreateCompanyForm } from "@/components/company/create-company-form"
import { getCompanies } from "@/lib/companies"
import { SearchSection } from "@/components/search-section"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams

  const companies = await getCompanies(search)

  return (
    <div className="">
      <h1 className="pb-4 text-2xl font-bold">Companies</h1>

      {companies.length == 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon
                icon={UserDollarIcon}
                // className="text-muted-foreground"
                // size={24}
                // color="#FFFFFF"
                // strokeWidth={1.5}
              />
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
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <SearchSection />

            <CreateCompanyForm
            // onSuccess={(newCompany: Company) => {
            //     companies.push(newCompany)
            //   }}
            />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {companies.map((company) => {
                return <CompanyCard key={company.id} company={company} />
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
