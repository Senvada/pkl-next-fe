"use client"

import * as React from "react"
import { Building2, Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CompanyHeaderProps {
  canCreate: boolean
  onOpenCreate: () => void
  onRefresh: () => void
  isLoading?: boolean
}

export function CompanyHeader({
  canCreate,
  onOpenCreate,
  onRefresh,
  isLoading,
}: CompanyHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40 shrink-0">
          <Building2 className="size-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Perusahaan Mitra (DU/DI)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola direktori mitra industri, pemetaan jurusan, kontak resmi, dan koordinat peta PKL.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-9 px-3 rounded-xl border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
        >
          <RefreshCw className={`size-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
          Segarkan
        </Button>

        {canCreate && (
          <Button
            size="sm"
            onClick={onOpenCreate}
            className="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all"
          >
            <Plus className="size-4 mr-1.5" />
            Tambah Perusahaan
          </Button>
        )}
      </div>
    </div>
  )
}
