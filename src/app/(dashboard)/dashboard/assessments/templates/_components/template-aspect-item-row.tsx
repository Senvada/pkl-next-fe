"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"
import type { AspectTemplateItem } from "@/types/assessment"

interface TemplateAspectItemRowProps {
  index: number
  item: AspectTemplateItem
  hasCategory?: boolean
  onChange: (updated: AspectTemplateItem) => void
  onDelete: () => void
}

export function TemplateAspectItemRow({
  index,
  item,
  hasCategory = false,
  onChange,
  onDelete,
}: TemplateAspectItemRowProps) {
  return (
    <div className="flex items-start gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/40">
      <span className="text-xs font-bold text-slate-400 mt-2.5 w-6 text-center shrink-0">
        {index + 1}.
      </span>

      <div className="flex-1 space-y-1.5">
        {hasCategory && (
          <input
            type="text"
            placeholder="Kategori (misal: Web develop, Mobile develop, K3LH)"
            value={item.category || ""}
            onChange={(e) => onChange({ ...item, category: e.target.value })}
            className="w-full text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 focus:outline-hidden"
          />
        )}
        <textarea
          rows={2}
          placeholder="Uraian indikator capaian sasaran / perilaku kerja..."
          value={item.title}
          onChange={(e) => onChange({ ...item, title: e.target.value })}
          className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden resize-none"
        />
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors mt-1"
        title="Hapus Indikator"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}
