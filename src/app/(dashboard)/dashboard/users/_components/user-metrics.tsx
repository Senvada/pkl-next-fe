import * as React from "react"
import { Users2, GraduationCap, Building2, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export interface UserMetricsData {
  total: number
  siswaCount: number
  industriCount: number
  guruAdminCount: number
}

interface UserMetricsProps {
  metrics: UserMetricsData
  mounted: boolean
}

export const UserMetrics = React.memo(function UserMetrics({ metrics, mounted }: UserMetricsProps) {
  const cards = [
    {
      label: "Total Akun Terdaftar",
      value: mounted ? metrics.total : "-",
      icon: Users2,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Siswa Peserta PKL",
      value: mounted ? metrics.siswaCount : "-",
      icon: GraduationCap,
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
    {
      label: "Akun Mitra Industri",
      value: mounted ? metrics.industriCount : "-",
      icon: Building2,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      label: "Admin & Guru",
      value: mounted ? metrics.guruAdminCount : "-",
      icon: ShieldCheck,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card key={idx} className="rounded-2xl border border-border bg-card/60 shadow-xs">
            <CardContent className="p-3.5 sm:p-4 flex items-center gap-3">
              <div className={`size-10 rounded-xl ${card.color} flex items-center justify-center shrink-0`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground truncate">
                  {card.label}
                </p>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {card.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
})
