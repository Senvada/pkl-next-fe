"use client"

import * as React from "react"
import type { BehaviorAspectItem } from "@/types/assessment"
import { AspectTableItem } from "./aspect-table-item"

interface BehaviorAspectsCardProps {
  behaviorAspects: BehaviorAspectItem[]
  isReadOnly: boolean
  onScoreChange: (idx: number, score: number) => void
}

export function BehaviorAspectsCard({
  behaviorAspects,
  isReadOnly,
  onScoreChange,
}: BehaviorAspectsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4 print:hidden">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
        2. Perilaku Kerja (Aspek Non-Teknis)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-500 uppercase">
              <th className="py-2 px-3 text-center">No</th>
              <th className="py-2 px-3">Aspek Perilaku</th>
              <th className="py-2 px-3 text-center">Nilai Angka</th>
              <th className="py-2 px-3 text-center">Huruf</th>
              <th className="py-2 px-3 text-center">Sebutan</th>
            </tr>
          </thead>
          <tbody>
            {behaviorAspects.map((item, idx) => (
              <AspectTableItem
                key={item.id || idx}
                index={idx}
                item={item}
                isReadOnly={isReadOnly}
                onScoreChange={(s) => onScoreChange(idx, s)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
