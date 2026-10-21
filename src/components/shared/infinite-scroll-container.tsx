"use client"

import React from "react"
import { Loader2 } from "lucide-react"

interface InfiniteScrollContainerProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  sentinelRef: React.RefObject<HTMLDivElement | null>
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  isLoading?: boolean
  totalCount?: number
  emptyState?: React.ReactNode
  endMessage?: React.ReactNode
  loadingIndicator?: React.ReactNode
  className?: string
  containerClassName?: string
}

/**
 * Reusable layout container for displaying items with infinite scroll
 */
export function InfiniteScrollContainer<T>({
  items,
  renderItem,
  sentinelRef,
  hasNextPage = false,
  isFetchingNextPage = false,
  isLoading = false,
  totalCount,
  emptyState,
  endMessage,
  className = "space-y-4",
  containerClassName = "",
}: InfiniteScrollContainerProps<T>) {
  if (isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
        <Loader2 className="size-7 animate-spin text-blue-600" />
        <span className="text-xs font-medium">Memuat data...</span>
      </div>
    )
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm">
        {emptyState || "Tidak ada data yang ditemukan."}
      </div>
    )
  }

  return (
    <div className={containerClassName}>
      <div className={className}>
        {items.map((item, index) => renderItem(item, index))}
      </div>

      {/* Sentinel element triggering intersection */}
      <div ref={sentinelRef} className="h-6 w-full -mt-2 pointer-events-none" />

      {/* Loading more state */}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-500 font-medium">
          <Loader2 className="size-4 animate-spin text-blue-600" />
          <span>Memuat data berikutnya...</span>
        </div>
      )}

      {/* End of list message */}
      {!hasNextPage && items.length > 0 && (
        <div className="py-8 text-center text-xs text-slate-400 border-t border-slate-100 dark:border-white/5 mt-6">
          {endMessage || (
            <span>
              Semua data telah ditampilkan ({totalCount ?? items.length} total)
            </span>
          )}
        </div>
      )}
    </div>
  )
}
