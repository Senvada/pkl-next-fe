"use client"

import * as React from "react"
import { CheckCircle2, Edit3, Layers } from "lucide-react"
import type { AssessmentTemplate } from "@/types/assessment"

interface TemplateCardProps {
  template: AssessmentTemplate
  onEdit: (template: AssessmentTemplate) => void
}

export function TemplateCard({ template, onEdit }: TemplateCardProps) {
  const workCount = template.work_aspects?.length || 0
  const behCount = template.behavior_aspects?.length || 0

  return (
    <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-sky-500/50 dark:hover:border-sky-500/50 shadow-xs transition-all group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            {template.department_code || "JURUSAN"}
          </span>
          <span className="text-xs text-slate-400">
            {template.period_name || "Periode Aktif"}
          </span>
        </div>

        <h3 className="font-semibold text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          {template.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {template.department_name}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
            <Layers className="size-3.5 text-sky-500" />
            <span>
              <strong className="text-slate-900 dark:text-white">{workCount}</strong> Sasaran Kerja
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            <span>
              <strong className="text-slate-900 dark:text-white">{behCount}</strong> Perilaku
            </span>
          </div>
        </div>

        <button
          onClick={() => onEdit(template)}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Edit3 className="size-4" />
          <span>Kelola Indikator</span>
        </button>
      </div>
    </div>
  )
}
