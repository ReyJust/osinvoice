import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

import { ClientCard } from '@/components/client/client-card'
// Types
// import { type Company } from "@/lib/types/user";

const companies: Company[] = [{
  name: "Acme Pty LTD",
  logo: '',
  contact_details: {
    address: "123 Main Street",
    city: "Sydney",
    postcode: "2000",
    country: "Australia"
  },
  payment_details: {
    bsb: "123-456",
    account_number: "12345678"
  }
},
{
  name: "Yo-Chi Pty LTD",
  logo: '',
  contact_details: {
    address: "123 Main Street",
    city: "Sydney",
    postcode: "2000",
    country: "Australia"
  },
  payment_details: {
    bsb: "123-456",
    account_number: "12345678"
  }
}
]

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // const { data: todos } = await supabase.from('todos').select()
  // console.log('todos', todos)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        {companies.map((company) => {
          return (
            // <ClientCard key={company.id} client={company} />
            <p></p>
          )
        })
        }
      </div>
    </div>
  )
}