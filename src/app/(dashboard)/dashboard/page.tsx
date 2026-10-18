import type { Metadata } from "next"
import Link from "next/link"
import {
  Users2,
  Building2,
  Newspaper,
  FolderOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Dashboard | Portal PKL SMKN 6 Malang",
  description: "Panel Administrasi dan Monitoring PKL Digital SMKN 6 Malang",
}

const quickLinks = [
  {
    title: "Manajemen Pengguna",
    description: "Pendataan akun siswa peserta, pembimbing, dan mentor industri mitra.",
    href: "/dashboard/users",
    icon: Users2,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    title: "Perusahaan Mitra",
    description: "Daftar direktori industri mitra tempat pelaksanaan Praktik Kerja Lapangan.",
    href: "/dashboard/companies",
    icon: Building2,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    title: "Artikel & Berita",
    description: "Publikasi panduan, pengumuman, dan artikel kegiatan PKL terbaru.",
    href: "/dashboard/articles",
    icon: Newspaper,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    title: "Galeri Aset Media",
    description: "Pustaka penyimpanan foto, cover artikel, dan berkas media terpusat.",
    href: "/dashboard/assets",
    icon: FolderOpen,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-blue-500/5 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Sparkles className="size-3.5" />
            <span>Sistem PKL Digital</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Selamat Datang di Portal PKL
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Pusat monitoring, pelaporan kegiatan, dan koordinasi antara siswa, sekolah, serta industri mitra SMKN 6 Malang.
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground">
          Akses Cepat Menu
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="group">
                <Card className="rounded-2xl border border-border shadow-xs bg-card/60 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md cursor-pointer h-full">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                      <Icon className="size-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        <ArrowRight className="size-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
