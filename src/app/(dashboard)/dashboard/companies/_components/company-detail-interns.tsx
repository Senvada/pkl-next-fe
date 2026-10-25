"use client"

import * as React from "react"
import { Users } from "lucide-react"
import { useCompanyInternsQuery } from "@/hooks/modules/company"
import type { CompanyIntern } from "@/types/company"
import { CompanyInternCard } from "@/components/shared/company-interns/company-intern-card"
import { CompanyInternDetailDialog } from "@/components/shared/company-interns/company-intern-detail-dialog"

interface CompanyDetailInternsProps {
  companySlug?: string
  companyId?: string
}

export function CompanyDetailInterns({ companySlug, companyId }: CompanyDetailInternsProps) {
  const { data: interns = [], isLoading } = useCompanyInternsQuery(
    companySlug || companyId,
    Boolean(companyId && !companySlug)
  )

  const [selectedIntern, setSelectedIntern] = React.useState<CompanyIntern | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const handleSelect = React.useCallback((intern: CompanyIntern) => {
    setSelectedIntern(intern)
    setDialogOpen(true)
  }, [])

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="size-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-2" />
        <p className="text-xs text-slate-400">Memuat data peserta PKL...</p>
      </div>
    )
  }

  if (interns.length === 0) {
    return (
      <div className="py-10 text-center rounded-2xl border border-dashed border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/2 my-2">
        <Users className="size-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Belum ada siswa terikat
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs mx-auto">
          Belum ada akun siswa PKL yang ditugaskan ke mitra industri ini.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Klik siswa untuk melihat detail pembimbing dan artikel:</span>
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {interns.length} Siswa
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
        {interns.map((intern) => (
          <CompanyInternCard key={intern.id} intern={intern} onSelect={handleSelect} />
        ))}
      </div>

      <CompanyInternDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        intern={selectedIntern}
      />
    </div>
  )
}
