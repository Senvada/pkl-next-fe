"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  ChevronsUpDown,
  Globe,
  LogOut,
  Moon,
  Sun,
  SunMoon,
  User as UserIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useCurrentUser, useLogout } from "@/hooks/modules/auth"

const themeOptions = [
  { label: "Terang", value: "light", icon: Sun },
  { label: "Gelap", value: "dark", icon: Moon },
  { label: "Sistem", value: "system", icon: SunMoon },
]

export type SidebarUser = {
  name: string
  email: string
  role?: string
  avatarUrl?: string | null
}

const defaultUser: SidebarUser = {
  name: "Administrator Hubin",
  email: "admin.hubin@smkn6malang.sch.id",
  role: "Super Admin",
}

export default function SidebarFooterSection({
  user: propUser,
  onLogout,
}: {
  user?: SidebarUser
  onLogout?: () => void
}) {
  const { isMobile } = useSidebar()
  const { theme, setTheme } = useTheme()
  const currentUser = useCurrentUser()
  const logoutMutation = useLogout()

  const user: SidebarUser = propUser || (currentUser ? {
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role_name,
    avatarUrl: currentUser.avatar_url,
  } : defaultUser)

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      logoutMutation.mutate()
    }
  }

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={user.name}
              className="cursor-pointer rounded-xl data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 shrink-0 rounded-lg border border-sidebar-border">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
                ) : null}
                <AvatarFallback className="rounded-lg bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400">
                  {initials || <UserIcon className="size-4" />}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-xs leading-tight transition-opacity duration-150 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden">
                <span className="truncate font-semibold text-sidebar-foreground">
                  {user.name}
                </span>
                <span className="truncate text-[10px] text-sidebar-foreground/60">
                  {user.role || user.email}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/50 transition-opacity duration-150 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-60 rounded-2xl border-sidebar-border bg-sidebar p-1.5 shadow-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="flex items-center gap-2.5 text-left text-xs">
                <Avatar className="size-8 rounded-lg border border-sidebar-border">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="rounded-lg bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 min-w-0">
                  <span className="truncate font-semibold text-foreground">
                    {user.name}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-sidebar-border" />

            {/* Theme switcher */}
            <DropdownMenuGroup>
              <div className="px-2 py-1 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                Tema Antarmuka
              </div>
              {themeOptions.map(({ label, value, icon: Icon }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => setTheme(value)}
                  className="cursor-pointer gap-2 rounded-lg text-xs"
                >
                  <Icon className="size-3.5 text-muted-foreground" />
                  <span>{label}</span>
                  {theme === value && (
                    <span className="ml-auto text-[10px] font-medium text-blue-600 dark:text-blue-400">
                      Aktif
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-sidebar-border" />

            {/* Quick Link to Profile */}
            <DropdownMenuItem asChild className="cursor-pointer gap-2 rounded-lg text-xs">
              <Link href="/dashboard/profile">
                <UserIcon className="size-3.5 text-muted-foreground" />
                <span>Profil Akun</span>
              </Link>
            </DropdownMenuItem>

            {/* Quick Link to Portal */}
            <DropdownMenuItem asChild className="cursor-pointer gap-2 rounded-lg text-xs">
              <Link href="/">
                <Globe className="size-3.5 text-muted-foreground" />
                <span>Ke Portal Publik</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-sidebar-border" />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer gap-2 rounded-lg text-xs text-rose-600 focus:bg-rose-500/10 focus:text-rose-600 dark:text-rose-400 dark:focus:bg-rose-950/30"
            >
              <LogOut className="size-3.5" />
              <span>Keluar dari Akun</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
