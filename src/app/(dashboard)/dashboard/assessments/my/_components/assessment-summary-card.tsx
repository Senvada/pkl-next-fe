"use client"

import * as React from "react"
import { Award, Calculator, CheckCircle } from "lucide-react"

interface AssessmentSummaryCardProps {
  workAverage: number
  behaviorAverage: number
  overallAverage: number
  overallLetter: string
  overallPredicate: string
}

export function AssessmentSummaryCard({
  workAverage,
  behaviorAverage,
  overallAverage,
  overallLetter,
  overallPredicate,
}: AssessmentSummaryCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-3">
        <div className="size-11 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
          <Calculator className="size-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Rerata Sasaran Kerja (Teknis)</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {workAverage.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-3">
        <div className="size-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="size-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Rerata Perilaku Kerja</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {behaviorAverage.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-600 text-white shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs text-sky-100 font-medium">Nilai Akhir Keseluruhan</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black">{overallAverage.toFixed(2)}</span>
            <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded-lg">
              {overallLetter} ({overallPredicate})
            </span>
          </div>
        </div>
        <Award className="size-9 text-white/80 shrink-0" />
      </div>
    </div>
  )
}
