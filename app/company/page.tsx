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

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

// import { Kbd } from "@/components/ui/kbd"

import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, UserDollarIcon } from "@hugeicons/core-free-icons"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

import { Company } from "@/lib/types/company"
import { CompanyCard } from "@/components/company/company-card"
import { CreateCompanyForm } from "@/components/company/create-company-form"

const companies: Company[] = [
  {
    id: 1,
    name: "Acme Pty LTD",
    // logo: "",
    email: "a@a.com",
    address: "123 Main Street",
    city: "Sydney",
    postcode: "2000",
    country: "Australia",
    state: "NSW",
    bsb: "123-456",
    account_number: "12345678",
    created_at: new Date(),
  },
  {
    id: 3,
    name: "Yo-CHi Pty LTD",
    // logo: "",
    email: "a@a.com",
    address: "123 Main Street",
    city: "Sydney",
    postcode: "2000",
    country: "Australia",
    state: "NSW",
    bsb: "123-456",
    account_number: "12345678",
    created_at: new Date(),
  },
]

// companies.length = 0

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // const { data: todos } = await supabase.from('todos').select()
  // console.log('todos', todos)

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
            <Button>Create new company</Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <Field className="max-w-1/2 bg-white">
              <ButtonGroup>
                <Input
                  id="input-button-group"
                  placeholder="Type to search..."
                />
                <Button variant="default" size="icon">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    // size={24}
                    // color="#FFFFFF"
                    // strokeWidth={1.5}
                  />
                </Button>
              </ButtonGroup>
            </Field>
            <CreateCompanyForm />
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
