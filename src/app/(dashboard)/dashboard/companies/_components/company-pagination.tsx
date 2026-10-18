"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PaginationMeta } from "@/types/auth"

interface CompanyPaginationProps {
  pagination?: PaginationMeta
  isBusy: boolean
  onPageChange: (page: number) => void
}

export const CompanyPagination = React.memo(function CompanyPagination({
  pagination,
  isBusy,
  onPageChange,
}: CompanyPaginationProps) {
  if (!pagination || pagination.total_pages <= 1) return null

  const from = (pagination.page - 1) * pagination.limit + 1
  const to = Math.min(pagination.page * pagination.limit, pagination.total_rows)

  return (
    <div className="p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#16212D] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Menampilkan <strong>{from}</strong> - <strong>{to}</strong> dari{" "}
        <strong>{pagination.total_rows}</strong> perusahaan
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
          disabled={!pagination.has_prev || isBusy}
          className="h-8 text-xs rounded-xl px-2.5 cursor-pointer border-slate-200 dark:border-white/10"
        >
          <ChevronLeft className="size-3.5 mr-1" />
          <span>Sebelumnya</span>
        </Button>

        <div className="flex items-center px-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
          Halaman {pagination.page} dari {pagination.total_pages}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onPageChange(Math.min(pagination.page + 1, pagination.total_pages))
          }
          disabled={!pagination.has_next || isBusy}
          className="h-8 text-xs rounded-xl px-2.5 cursor-pointer border-slate-200 dark:border-white/10"
        >
          <span>Selanjutnya</span>
          <ChevronRight className="size-3.5 ml-1" />
        </Button>
      </div>
    </div>
  )
})
