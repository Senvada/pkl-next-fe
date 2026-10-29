"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"

interface AspectTableItemProps {
  index: number
  item: {
    id: string
    category?: string
    title: string
    is_custom?: boolean
    score_numeric: number
    score_letter: string
    score_predicate: string
  }
  isReadOnly: boolean
  onScoreChange: (score: number) => void
  onTitleChange?: (title: string) => void
  onDelete?: () => void
}

export function AspectTableItem({
  index,
  item,
  isReadOnly,
  onScoreChange,
  onTitleChange,
  onDelete,
}: AspectTableItemProps) {
  return (
    <tr className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="py-2.5 px-3 text-xs font-semibold text-slate-400 text-center w-10">
        {index + 1}
      </td>

      <td className="py-2.5 px-3 text-sm">
        {item.is_custom ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200 dark:border-violet-800 shrink-0">
              Khusus Siswa
            </span>
            <input
              type="text"
              disabled={isReadOnly}
              placeholder="Tuliskan indikator kompetensi khusus yang dikerjakan di DUDI..."
              value={item.title}
              onChange={(e) => onTitleChange?.(e.target.value)}
              className="w-full text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>
        ) : (
          <div>
            {item.category && (
              <span className="inline-block text-[11px] font-bold text-sky-600 dark:text-sky-400 mr-2">
                [{item.category}]
              </span>
            )}
            <span className="text-slate-800 dark:text-slate-200 font-medium text-xs">
              {item.title}
            </span>
          </div>
        )}
      </td>

      <td className="py-2.5 px-3 text-center w-24">
        <input
          type="number"
          min="0"
          max="100"
          step="0.5"
          disabled={isReadOnly}
          value={item.score_numeric || ""}
          onChange={(e) => onScoreChange(parseFloat(e.target.value) || 0)}
          placeholder="0-100"
          className="w-18 text-center text-xs font-bold px-2 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
        />
      </td>

      <td className="py-2.5 px-3 text-center text-xs font-bold text-slate-700 dark:text-slate-300 w-16">
        {item.score_letter || "-"}
      </td>

      <td className="py-2.5 px-3 text-center text-xs font-medium text-slate-600 dark:text-slate-400 w-28">
        {item.score_predicate || "-"}
      </td>

      {onDelete && (
        <td className="py-2.5 px-2 text-center w-10">
          {item.is_custom && !isReadOnly && (
            <button
              type="button"
              onClick={onDelete}
              className="text-slate-400 hover:text-red-500 p-1 rounded-md"
              title="Hapus indikator khusus"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </td>
      )}
    </tr>
  )
}
