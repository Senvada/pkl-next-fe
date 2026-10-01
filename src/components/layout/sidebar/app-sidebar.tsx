"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import SidebarHeaderSection from "./sidebar-header-section"
import NavItem from "./nav-item"
import SidebarFooterSection, { type SidebarUser } from "./sidebar-footer-section"
import { defaultNavData, type SideNavGroup } from "./nav-data"

export interface AppSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  navData?: SideNavGroup[]
  user?: SidebarUser
  onLogout?: () => void
}

export function AppSidebar({
  navData = defaultNavData,
  user,
  onLogout,
  collapsible = "icon",
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible={collapsible} {...props}>
      {/* Top Header Logo */}
      <SidebarHeader className="border-b border-sidebar-border px-3 py-2.5">
        <SidebarHeaderSection />
      </SidebarHeader>

      {/* Nav Menu Content */}
      <SidebarContent className="px-2 py-3">
        {navData.map((group, idx) => (
          <SidebarGroup key={group.group} className="p-0 mb-3">
            <SidebarGroupLabel className="px-2.5 text-[11px] font-bold">
              {group.group}
            </SidebarGroupLabel>

            {/* Subtle separator in collapsed icon mode */}
            <div
              aria-hidden
              className="mx-auto my-1.5 hidden h-px w-6 bg-sidebar-border group-data-[collapsible=icon]:block"
            />

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavItem key={item.title} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>

            {idx < navData.length - 1 && (
              <SidebarSeparator className="my-2 hidden group-data-[collapsible=icon]:hidden" />
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Bottom Footer User Profile */}
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div
          aria-hidden
          className="mx-auto mb-1 hidden h-px w-6 bg-sidebar-border group-data-[collapsible=icon]:block"
        />
        <SidebarFooterSection user={user} onLogout={onLogout} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
