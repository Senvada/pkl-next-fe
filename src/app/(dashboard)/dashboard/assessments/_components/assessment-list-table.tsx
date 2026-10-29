"use client"

import * as React from "react"
import { Eye, FileDown } from "lucide-react"
import type { StudentAssessment } from "@/types/assessment"
import { generateAssessmentPDF } from "@/lib/assessment/generate-pdf"

interface AssessmentListTableProps {
  assessments: StudentAssessment[]
  onSelect: (assessment: StudentAssessment) => void
}

export function AssessmentListTable({ assessments, onSelect }: AssessmentListTableProps) {
  if (assessments.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-8">
        <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
          Belum ada data penilaian siswa.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Siswa yang dibimbing akan muncul di sini setelah mengisi draf atau menyerahkan penilaian.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/40">
              <th className="py-3 px-4">Siswa</th>
              <th className="py-3 px-4">Jurusan</th>
              <th className="py-3 px-4">DUDI</th>
              <th className="py-3 px-4 text-center">Rerata Sasaran</th>
              <th className="py-3 px-4 text-center">Nilai Akhir</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {assessments.map((sa) => {
              const statusBadge = {
                draft: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
                submitted: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800",
                verified: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
              }[sa.status] || "bg-slate-100 text-slate-700"

              return (
                <tr key={sa.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-xs text-slate-900 dark:text-white">
                      {sa.student_name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {sa.student_nis || "-"} • {sa.student_class || "-"}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {sa.department_code || sa.department_name}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-slate-700 dark:text-slate-300">
                    <p className="font-medium line-clamp-1">{sa.company_name || "-"}</p>
                    <p className="text-[11px] text-slate-400">{sa.supervisor_name || "-"}</p>
                  </td>

                  <td className="py-3.5 px-4 text-center text-xs font-semibold text-slate-900 dark:text-white">
                    {sa.work_average ? sa.work_average.toFixed(2) : "-"}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                      {sa.overall_average ? sa.overall_average.toFixed(2) : "-"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadge}`}>
                      {sa.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => generateAssessmentPDF(sa)}
                        title="Unduh PDF Lembar Penilaian"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        <FileDown className="size-3.5" />
                      </button>
                      <button
                        onClick={() => onSelect(sa)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        <Eye className="size-3.5" />
                        <span>Detail</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
