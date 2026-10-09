"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/companies": "Perusahaan Mitra",
  "/dashboard/articles": "Artikel & Berita",
  "/dashboard/assets": "Galeri Aset",
  "/dashboard/users": "Manajemen Pengguna",
  "/dashboard/roles": "Hak Akses & Role",
  "/dashboard/profile": "Profil Akun",
  "/dashboard/profile/edit": "Edit Profil",
  "/dashboard/settings": "Pengaturan Sistem",
}

export function DashboardBreadcrumb() {
  const pathname = usePathname()
  const isDashboardRoot = pathname === "/dashboard"

  const segments = pathname.split("/").filter(Boolean)
  const currentLabel =
    routeLabels[pathname] ??
    (segments.length > 0
      ? segments[segments.length - 1].charAt(0).toUpperCase() +
        segments[segments.length - 1].slice(1)
      : "Dashboard")

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {isDashboardRoot ? (
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isDashboardRoot && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
