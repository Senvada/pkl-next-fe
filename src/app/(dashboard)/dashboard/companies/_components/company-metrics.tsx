"use client"

import * as React from "react"
import { Building2, CheckCircle, MapPin, Users } from "lucide-react"

interface CompanyMetricsProps {
  total: number
  activeCount: number
  mappedCount: number
  totalMembers: number
}

export function CompanyMetrics({
  total,
  activeCount,
  mappedCount,
  totalMembers,
}: CompanyMetricsProps) {
  const cards = [
    {
      label: "Total Mitra Industri",
      value: total,
      sub: "Seluruh mitra terdaftar",
      icon: Building2,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Mitra Aktif",
      value: activeCount,
      sub: "Bisa menerima penempatan",
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Terplot di Peta",
      value: mappedCount,
      sub: "Memiliki koordinat GPS",
      icon: MapPin,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: "Siswa & PIC Terkait",
      value: totalMembers,
      sub: "Akun terhubung ke industri",
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <div
            key={c.label}
            className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#16212D] shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {c.label}
              </span>
              <div className={`p-2 rounded-xl ${c.bg} ${c.color}`}>
                <Icon className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {c.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                {c.sub}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
