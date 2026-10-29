"use client"

import * as React from "react"
import { Calendar, Copy, Loader2, X } from "lucide-react"
import type { AcademicPeriod } from "@/types/assessment"

interface PeriodCreateDialogProps {
  isOpen: boolean
  periods: AcademicPeriod[]
  onClose: () => void
  onSubmit: (payload: {
    name: string
    is_active?: boolean
    copy_from_id?: string
  }) => Promise<void>
}

export function PeriodCreateDialog({
  isOpen,
  periods,
  onClose,
  onSubmit,
}: PeriodCreateDialogProps) {
  const [name, setName] = React.useState("")
  const [isActive, setIsActive] = React.useState(false)
  const [copyFromId, setCopyFromId] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({
        name,
        is_active: isActive,
        copy_from_id: copyFromId || undefined,
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Tambah Periode Akademik Baru
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama Periode (Tahun Ajaran)
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: 2026/2027"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Salin Indikator Penilaian dari Periode Lain (Opsional)
            </label>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2">
              <Copy className="size-4 text-slate-400 shrink-0" />
              <select
                value={copyFromId}
                onChange={(e) => setCopyFromId(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
              >
                <option value="" className="dark:bg-slate-900">
                  -- Mulai template baru (kosong) --
                </option>
                {periods.map((p) => (
                  <option key={p.id} value={p.id} className="dark:bg-slate-900">
                    Salin dari {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="size-4 rounded text-sky-600 focus:ring-sky-500"
            />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Jadikan sebagai periode akademik aktif saat ini
            </span>
          </label>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              <span>Buat Periode</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
