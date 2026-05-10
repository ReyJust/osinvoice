import Link from "next/link"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function NavMenu() {

    const menu_items = [{
        name: "Invoices",
        href: "/invoices"
    },
    {
        name: "Clients",
        href: "/clients"
    },
    {
        name: "Profile",
        href: "/profile"
    }]

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {menu_items.map((item) => (
                    <NavigationMenuItem key={item.name}>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href={item.href}>{item.name}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu >
    )
}