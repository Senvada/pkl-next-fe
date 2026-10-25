"use client"

import * as React from "react"
import { Users, Search } from "lucide-react"
import { useCompanyInternsQuery } from "@/hooks/modules/company"
import type { CompanyIntern } from "@/types/company"
import { CompanyInternCard } from "./company-intern-card"
import { CompanyInternDetailDialog } from "./company-intern-detail-dialog"

interface CompanyInternsSectionProps {
  companyName: string
  slug?: string
  companyId?: string
  initialInterns?: CompanyIntern[]
}

export function CompanyInternsSection({
  companyName,
  slug,
  companyId,
  initialInterns = [],
}: CompanyInternsSectionProps) {
  const { data: interns = initialInterns, isLoading } = useCompanyInternsQuery(
    slug || companyId,
    Boolean(companyId && !slug)
  )

  const [search, setSearch] = React.useState("")
  const [selectedIntern, setSelectedIntern] = React.useState<CompanyIntern | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const handleSelect = React.useCallback((intern: CompanyIntern) => {
    setSelectedIntern(intern)
    setDialogOpen(true)
  }, [])

  const filteredInterns = React.useMemo(() => {
    if (!search.trim()) return interns
    const q = search.toLowerCase().trim()
    return interns.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.department?.name.toLowerCase().includes(q) ||
        it.department?.code.toLowerCase().includes(q) ||
        it.supervisor?.name.toLowerCase().includes(q)
    )
  }, [interns, search])

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="bg-white dark:bg-[#16212D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Users className="size-4.5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Peserta &amp; Alumni PKL
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {interns.length} Siswa
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Daftar siswa yang sedang atau pernah menjalani praktik kerja di {companyName}.
            </p>
          </div>

          {interns.length > 3 && (
            <div className="relative w-full sm:w-64">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa atau jurusan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8.5 pl-8.5 pr-3 text-xs rounded-xl border border-input bg-background focus:outline-hidden focus:ring-1 focus:ring-ring"
              />
            </div>
          )}
        </div>

        {isLoading && interns.length === 0 ? (
          <div className="py-12 text-center">
            <div className="size-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-2" />
            <p className="text-xs text-slate-400">Memuat data peserta PKL...</p>
          </div>
        ) : filteredInterns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredInterns.map((intern) => (
              <CompanyInternCard key={intern.id} intern={intern} onSelect={handleSelect} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center rounded-2xl border border-dashed border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/2">
            <Users className="size-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {search.trim() ? "Tidak ada siswa yang sesuai pencarian" : "Belum ada siswa yang terhubung"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {search.trim()
                ? "Coba gunakan kata kunci nama atau jurusan lain."
                : "Belum ada riwayat siswa yang melaksanakan PKL pada mitra industri ini."}
            </p>
          </div>
        )}
      </div>

      <CompanyInternDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        intern={selectedIntern}
      />
    </section>
  )
}
