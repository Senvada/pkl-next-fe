"use client"

import * as React from "react"
import { Building2 } from "lucide-react"
import type { Company } from "@/types/company"
import { CompanyTableRow } from "./company-table-row"
import { CompanyMobileCard } from "./company-mobile-card"

interface CompanyTableProps {
  companies: Company[]
  isLoading: boolean
  isAdmin: boolean
  myCompanyId?: string | null
  onDetail: (company: Company) => void
  onEdit: (company: Company) => void
  onDelete: (company: Company) => void
}

export function CompanyTable({
  companies,
  isLoading,
  isAdmin,
  myCompanyId,
  onDetail,
  onEdit,
  onDelete,
}: CompanyTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#16212D] p-12 text-center shadow-xs">
        <div className="inline-block size-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Memuat data perusahaan...
        </p>
      </div>
    )
  }

  if (companies.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#16212D] p-12 text-center shadow-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400">
          <Building2 className="size-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:white">
          Tidak ada data perusahaan mitra
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Tidak ditemukan mitra industri yang cocok dengan filter atau kata kunci pencarian Anda.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#16212D] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200/80 dark:border-white/10 bg-slate-50/75 dark:bg-white/5 font-semibold text-slate-600 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-4 py-3.5">Perusahaan Mitra</th>
                <th scope="col" className="px-4 py-3.5">Jurusan yang Diterima</th>
                <th scope="col" className="px-4 py-3.5">Kontak & Lokasi</th>
                <th scope="col" className="px-4 py-3.5 text-center">Anggota Terkait</th>
                <th scope="col" className="px-4 py-3.5 text-center">Status</th>
                <th scope="col" className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {companies.map((comp) => (
                <CompanyTableRow
                  key={comp.id}
                  comp={comp}
                  canEdit={isAdmin || (myCompanyId != null && myCompanyId === comp.id)}
                  canDelete={isAdmin}
                  onDetail={onDetail}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {companies.map((comp) => (
          <CompanyMobileCard
            key={comp.id}
            comp={comp}
            canEdit={isAdmin || (myCompanyId != null && myCompanyId === comp.id)}
            canDelete={isAdmin}
            onDetail={onDetail}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
