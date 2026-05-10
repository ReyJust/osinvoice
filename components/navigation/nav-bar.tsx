import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from '@hugeicons/core-free-icons';

import { Button } from "@/components/ui/button"

import {
    NavMenu,
} from "@/components/navigation/nav-menu"
import { CompanySwitcher } from "@/components/navigation/company-switcher";
// Types
import { type company } from "@/lib/types/navigation";


export function NavBar({
    companies: companies,
    current_company: current_company,
}: {
    companies: company[],
    current_company: company
}) {
    return (
        <header className="flex h-16 shrink-0 justify-between items-center gap-2 border-b px-4">
            <div>
                <CompanySwitcher companies={companies} current_company={current_company} />
            </div>
            <NavMenu />

            <Button size="sm">
                New
                <HugeiconsIcon
                    icon={PlusSignIcon}
                // size={24}
                // color="currentColor"
                // strokeWidth={1.5}
                />
            </Button>

        </header>

    )
}