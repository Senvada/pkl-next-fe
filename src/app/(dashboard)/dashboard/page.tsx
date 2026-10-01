import type { Metadata } from "next"
import { LayoutDashboard } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard | Portal PKL SMKN 6 Malang",
  description: "Panel Administrasi dan Monitoring PKL Digital SMKN 6 Malang",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Selamat datang di Panel Administrasi &amp; Monitoring PKL Digital SMKN 6 Malang.
        </p>
      </div>

      {/* Kosongan / Blank Placeholder Canvas */}
      <div className="flex min-h-[460px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/80 bg-background/50 p-8 text-center transition-colors">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-3">
          <LayoutDashboard className="size-6" />
        </div>
        <h2 className="text-base font-bold text-foreground">
          Area Konten Dashboard Kosong
        </h2>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          Struktur layout dan sidebar telah siap dan konsisten dengan sistem desain. Konten dashboard dapat diisi pada tahapan berikutnya.
        </p>
      </div>
    </div>
  )
}
