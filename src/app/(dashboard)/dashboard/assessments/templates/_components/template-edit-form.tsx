"use client"

import * as React from "react"
import { Loader2, Plus } from "lucide-react"
import type { AssessmentTemplate, AspectTemplateItem } from "@/types/assessment"
import { TemplateAspectItemRow } from "./template-aspect-item-row"

interface TemplateEditFormProps {
  template: AssessmentTemplate
  onClose: () => void
  onSave: (payload: {
    title: string
    work_aspects: AspectTemplateItem[]
    behavior_aspects: AspectTemplateItem[]
  }) => Promise<void>
}

export function TemplateEditForm({ template, onClose, onSave }: TemplateEditFormProps) {
  const [title, setTitle] = React.useState(template.title || "")
  const [workAspects, setWorkAspects] = React.useState<AspectTemplateItem[]>(template.work_aspects || [])
  const [behAspects, setBehAspects] = React.useState<AspectTemplateItem[]>(template.behavior_aspects || [])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleAddWork = () => setWorkAspects([...workAspects, { id: crypto.randomUUID(), title: "", category: "" }])
  const handleAddBeh = () => setBehAspects([...behAspects, { id: crypto.randomUUID(), title: "" }])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave({
        title,
        work_aspects: workAspects.filter((item) => item.title.trim() !== ""),
        behavior_aspects: behAspects.filter((item) => item.title.trim() !== ""),
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-6">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Judul Format Penilaian
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-slate-900 dark:text-white">
            1. Capaian Sasaran Kerja (Aspek Teknis)
          </label>
          <button
            type="button"
            onClick={handleAddWork}
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
          >
            <Plus className="size-3.5" /> Tambah Indikator Teknis
          </button>
        </div>
        <div className="space-y-2.5">
          {workAspects.map((item, idx) => (
            <TemplateAspectItemRow
              key={item.id || idx}
              index={idx}
              item={item}
              hasCategory
              onChange={(up) => {
                const next = [...workAspects]
                next[idx] = up
                setWorkAspects(next)
              }}
              onDelete={() => setWorkAspects(workAspects.filter((_, i) => i !== idx))}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-slate-900 dark:text-white">
            2. Perilaku Kerja (Aspek Non-Teknis)
          </label>
          <button
            type="button"
            onClick={handleAddBeh}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            <Plus className="size-3.5" /> Tambah Perilaku Kerja
          </button>
        </div>
        <div className="space-y-2.5">
          {behAspects.map((item, idx) => (
            <TemplateAspectItemRow
              key={item.id || idx}
              index={idx}
              item={item}
              onChange={(up) => {
                const next = [...behAspects]
                next[idx] = up
                setBehAspects(next)
              }}
              onDelete={() => setBehAspects(behAspects.filter((_, i) => i !== idx))}
            />
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900 pb-1">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          <span>Simpan Perubahan</span>
        </button>
      </div>
    </form>
  )
}
