"use client"

import * as React from "react"
import { X } from "lucide-react"
import type { AssessmentTemplate, AspectTemplateItem } from "@/types/assessment"
import { TemplateEditForm } from "./template-edit-form"

interface TemplateEditDialogProps {
  template: AssessmentTemplate | null
  isOpen: boolean
  onClose: () => void
  onSave: (payload: {
    title: string
    work_aspects: AspectTemplateItem[]
    behavior_aspects: AspectTemplateItem[]
  }) => Promise<void>
}

export function TemplateEditDialog({
  template,
  isOpen,
  onClose,
  onSave,
}: TemplateEditDialogProps) {
  if (!isOpen || !template) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/10 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Kelola Indikator Nilai - {template.department_code}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Periode: {template.period_name} ({template.department_name})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <TemplateEditForm
          key={template.id}
          template={template}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  )
}
