"use client"

import * as React from "react"
import { FileDown, X } from "lucide-react"
import type { StudentAssessment } from "@/types/assessment"
import { generateAssessmentPDF } from "@/lib/assessment/generate-pdf"
import { AssessmentPrintableView } from "../my/_components/assessment-printable-view"

interface AssessmentDetailModalProps {
  assessment: StudentAssessment | null
  isOpen: boolean
  onClose: () => void
}

export function AssessmentDetailModal({
  assessment,
  isOpen,
  onClose,
}: AssessmentDetailModalProps) {
  if (!isOpen || !assessment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 shrink-0 print:hidden">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Detail Penilaian Siswa - {assessment.student_name}
            </h2>
            <p className="text-xs text-slate-500">
              {assessment.department_name} • {assessment.company_name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generateAssessmentPDF(assessment)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-colors"
            >
              <FileDown className="size-3.5" />
              <span>Unduh PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 text-xs">
            <div>
              <p className="text-slate-400">NIS / Kelas</p>
              <p className="font-semibold text-slate-900 dark:text-white">{assessment.student_nis || "-"} ({assessment.student_class || "-"})</p>
            </div>
            <div>
              <p className="text-slate-400">Perusahaan DUDI</p>
              <p className="font-semibold text-slate-900 dark:text-white">{assessment.company_name}</p>
            </div>
            <div>
              <p className="text-slate-400">Rerata Sasaran</p>
              <p className="font-semibold text-slate-900 dark:text-white">{assessment.work_average?.toFixed(2) || "-"}</p>
            </div>
            <div>
              <p className="text-slate-400">Nilai Akhir</p>
              <p className="font-bold text-sky-600 dark:text-sky-400 text-sm">{assessment.overall_average?.toFixed(2) || "-"}</p>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-white/10 rounded-xl p-4 bg-white dark:bg-slate-950">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Pratinjau Lembar Resmi Penilaian:
            </h3>
            <div className="block p-4 border border-dashed border-slate-200 dark:border-white/10 rounded-lg overflow-x-auto">
              <AssessmentPrintableView assessment={assessment} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
