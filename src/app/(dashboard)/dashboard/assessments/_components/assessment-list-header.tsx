"use client"

import * as React from "react"
import { Calendar, Search } from "lucide-react"
import type { AcademicPeriod } from "@/types/assessment"

interface AssessmentListHeaderProps {
  periods: AcademicPeriod[]
  selectedPeriodId?: string
  searchTerm: string
  onPeriodChange: (id: string) => void
  onSearchChange: (val: string) => void
}

export function AssessmentListHeader({
  periods,
  selectedPeriodId,
  searchTerm,
  onPeriodChange,
  onSearchChange,
}: AssessmentListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-white/10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Rekap Penilaian Siswa PKL
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pantau dan cetak lembar penilaian praktik kerja lapangan siswa berdasarkan jurusan bimbingan Anda.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama siswa, NIS, atau DUDI..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-64 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 shadow-xs">
          <Calendar className="size-4 text-slate-400" />
          <select
            value={selectedPeriodId || ""}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
          >
            <option value="" className="dark:bg-slate-900">
              Semua Periode
            </option>
            {periods.map((p) => (
              <option key={p.id} value={p.id} className="dark:bg-slate-900">
                {p.name} {p.is_active ? "(Aktif)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
