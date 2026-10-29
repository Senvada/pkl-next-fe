"use client"

import * as React from "react"
import { Calendar, Plus } from "lucide-react"
import type { AcademicPeriod } from "@/types/assessment"

interface TemplateHeaderProps {
  periods: AcademicPeriod[]
  selectedPeriodId?: string
  onPeriodChange: (id: string) => void
  onOpenCreatePeriod: () => void
}

export function TemplateHeader({
  periods,
  selectedPeriodId,
  onPeriodChange,
  onOpenCreatePeriod,
}: TemplateHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-white/10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Template Penilaian PKL
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Kelola indikator capaian sasaran kerja & perilaku kerja berdasarkan jurusan dan periode akademik.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 shadow-xs">
          <Calendar className="size-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Periode:
          </span>
          <select
            value={selectedPeriodId || ""}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
          >
            {periods.map((p) => (
              <option key={p.id} value={p.id} className="dark:bg-slate-900">
                {p.name} {p.is_active ? "(Aktif)" : ""}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onOpenCreatePeriod}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-colors"
        >
          <Plus className="size-4" />
          <span>Periode Baru</span>
        </button>
      </div>
    </div>
  )
}
