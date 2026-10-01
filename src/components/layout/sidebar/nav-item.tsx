"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import type { SideNavItem } from "./nav-data"

export default function NavItem({ item }: { item: SideNavItem }) {
  const pathname = usePathname()
  const isActive =
    pathname === item.url ||
    (item.url !== "/dashboard" && pathname.startsWith(item.url))
  const Icon = item.icon

  // Submenu branching (nested children)
  if (item.items && item.items.length > 0) {
    const isChildActive = item.items.some((child) => pathname.startsWith(child.url))

    return (
      <Collapsible
        defaultOpen={isChildActive}
        className="group/collapsible mb-0.5 group-data-[collapsible=icon]:hidden"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isChildActive}
              className="cursor-pointer font-medium"
            >
              {Icon && <Icon className="size-4 shrink-0 text-sidebar-foreground/70" />}
              <span className="flex-1 truncate">{item.title}</span>
              <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarMenuItem>

        <CollapsibleContent>
          <SidebarMenuSub className="mt-1">
            {item.items.map((subItem) => {
              const isSubActive = pathname === subItem.url
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild isActive={isSubActive}>
                    <Link href={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  // Single Menu Item
  return (
    <SidebarMenuItem className="mb-0.5">
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className="cursor-pointer font-medium transition-colors"
      >
        <Link href={item.url}>
          {Icon && (
            <Icon
              className={`size-4.5 shrink-0 ${
                isActive ? "text-blue-600 dark:text-blue-400" : "text-sidebar-foreground/70"
              }`}
            />
          )}
          <span className="flex-1 truncate">{item.title}</span>
          {item.badge !== undefined && (
            <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
