import {
  Building2,
  FolderKanban,
  LayoutDashboard,
  Newspaper,
  Settings,
  ShieldCheck,
  UserCog,
  Users2,
  type LucideIcon,
} from "lucide-react"

export type SideNavItem = {
  title: string
  url: string
  icon?: LucideIcon
  badge?: string | number
  module?: string
  adminOnly?: boolean
  items?: SideNavItem[]
}

export type SideNavGroup = {
  group: string
  items: SideNavItem[]
}

export const defaultNavData: SideNavGroup[] = [
  {
    group: "Utama",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "Manajemen PKL",
    items: [
      {
        title: "Perusahaan Mitra",
        url: "/dashboard/companies",
        icon: Building2,
        module: "company",
      },
      {
        title: "Artikel & Berita",
        url: "/dashboard/articles",
        icon: Newspaper,
        module: "article",
      },
      {
        title: "Galeri Aset",
        url: "/dashboard/assets",
        icon: FolderKanban,
        module: "asset",
      },
    ],
  },
  {
    group: "Pengguna & Akses",
    items: [
      {
        title: "Manajemen Pengguna",
        url: "/dashboard/users",
        icon: Users2,
        module: "users",
      },
      {
        title: "Hak Akses & Role",
        url: "/dashboard/roles",
        icon: ShieldCheck,
        module: "role",
      },
    ],
  },
  {
    group: "Sistem",
    items: [
      {
        title: "Profil Akun",
        url: "/dashboard/profile",
        icon: UserCog,
      },
      {
        title: "Pengaturan",
        url: "/dashboard/settings",
        icon: Settings,
        adminOnly: true,
      },
    ],
  },
]
