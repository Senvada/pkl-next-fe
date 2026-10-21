"use client"

import React from "react"
import { Loader2, CheckCircle2 } from "lucide-react"

interface InfiniteScrollFooterProps {
  sentinelRef: React.RefObject<HTMLDivElement | null>
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  currentCount: number
  totalCount?: number
  itemLabel?: string
  className?: string
}

/**
 * Reusable footer for tables and list containers using infinite scroll
 */
export function InfiniteScrollFooter({
  sentinelRef,
  hasNextPage = false,
  isFetchingNextPage = false,
  currentCount,
  totalCount,
  itemLabel = "data",
  className = "",
}: InfiniteScrollFooterProps) {
  if (currentCount === 0) return null

  const total = totalCount ?? currentCount

  return (
    <div className={`p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 flex flex-col items-center justify-center gap-2 ${className}`}>
      {/* Sentinel element triggering intersection */}
      <div ref={sentinelRef} className="h-4 w-full pointer-events-none -mt-4" />

      {isFetchingNextPage ? (
        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium py-1 animate-pulse">
          <Loader2 className="size-4 animate-spin" />
          <span>Memuat {itemLabel} selanjutnya...</span>
        </div>
      ) : hasNextPage ? (
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          Menampilkan <strong className="text-slate-800 dark:text-white font-semibold">{currentCount}</strong> dari <strong className="text-slate-800 dark:text-white font-semibold">{total}</strong> {itemLabel} &bull; <span className="text-blue-600 dark:text-blue-400">Scroll ke bawah untuk memuat otomatis</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 py-1">
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          <span>Seluruh <strong className="text-slate-700 dark:text-slate-300 font-medium">{total}</strong> {itemLabel} telah dimuat</span>
        </div>
      )}
    </div>
  )
}
