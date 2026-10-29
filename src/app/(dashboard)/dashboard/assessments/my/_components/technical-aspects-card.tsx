"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import type { WorkAspectItem } from "@/types/assessment"
import { AspectTableItem } from "./aspect-table-item"

interface TechnicalAspectsCardProps {
  workAspects: WorkAspectItem[]
  isReadOnly: boolean
  onAddCustomWork: () => void
  onScoreChange: (idx: number, score: number) => void
  onTitleChange: (idx: number, title: string) => void
  onDelete: (idx: number) => void
}

export function TechnicalAspectsCard({
  workAspects,
  isReadOnly,
  onAddCustomWork,
  onScoreChange,
  onTitleChange,
  onDelete,
}: TechnicalAspectsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4 print:hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          1. Capaian Sasaran Kerja (Aspek Teknis)
        </h2>
        {!isReadOnly && (
          <button
            type="button"
            onClick={onAddCustomWork}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 transition-colors"
          >
            <Plus className="size-3.5" /> Tambah Penilaian Khusus DUDI
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-500 uppercase">
              <th className="py-2 px-3 text-center">No</th>
              <th className="py-2 px-3">Indikator Sasaran Kerja</th>
              <th className="py-2 px-3 text-center">Nilai Angka</th>
              <th className="py-2 px-3 text-center">Huruf</th>
              <th className="py-2 px-3 text-center">Sebutan</th>
              {!isReadOnly && <th className="py-2 px-3 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {workAspects.map((item, idx) => (
              <AspectTableItem
                key={item.id || idx}
                index={idx}
                item={item}
                isReadOnly={isReadOnly}
                onScoreChange={(s) => onScoreChange(idx, s)}
                onTitleChange={(t) => onTitleChange(idx, t)}
                onDelete={() => onDelete(idx)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
