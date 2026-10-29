"use client"

import * as React from "react"
import { FileDown, Loader2, Save, Send } from "lucide-react"

interface StudentAssessmentHeaderProps {
  status: "draft" | "submitted" | "verified"
  isSaving: boolean
  isReadOnly: boolean
  onSave: (status: "draft" | "submitted") => void
  onPrint: () => void
}

export function StudentAssessmentHeader({
  status,
  isSaving,
  isReadOnly,
  onSave,
  onPrint,
}: StudentAssessmentHeaderProps) {
  const statusBadge = {
    draft: { label: "Draf", bg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
    submitted: { label: "Terkirim", bg: "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800" },
    verified: { label: "Terverifikasi", bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  }[status] || { label: status, bg: "bg-slate-100 text-slate-700" }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-white/10 print:hidden">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Penilaian Praktik Kerja Lapangan
          </h1>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.bg}`}>
            {statusBadge.label}
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Isi nilai capaian sasaran kerja & perilaku kerja sesuai dengan evaluasi dari pimpinan atau pembimbing DUDI.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs transition-colors"
        >
          <FileDown className="size-4" />
          <span>Unduh PDF</span>
        </button>

        {!isReadOnly && (
          <>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => onSave("draft")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs transition-colors"
            >
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              <span>Simpan Draf</span>
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => onSave("submitted")}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-colors"
            >
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              <span>Kirim Penilaian</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
