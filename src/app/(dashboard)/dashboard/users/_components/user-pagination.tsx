import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PaginationMeta } from "@/types/auth"

interface UserPaginationProps {
  pagination?: PaginationMeta
  isBusy: boolean
  onPageChange: (page: number) => void
}

export const UserPagination = React.memo(function UserPagination({ pagination, isBusy, onPageChange }: UserPaginationProps) {
  if (!pagination || pagination.total_pages <= 1) return null

  const from = (pagination.page - 1) * pagination.limit + 1
  const to = Math.min(pagination.page * pagination.limit, pagination.total_rows)

  return (
    <div className="p-3 sm:p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">
        Menampilkan <strong>{from}</strong> - <strong>{to}</strong> dari <strong>{pagination.total_rows}</strong> pengguna
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
          disabled={!pagination.has_prev || isBusy}
          className="h-8 text-xs rounded-xl px-2.5 cursor-pointer"
        >
          <ChevronLeft className="size-3.5 mr-1" />
          <span>Sebelumnya</span>
        </Button>

        <div className="flex items-center px-2 text-xs font-semibold text-foreground">
          Halaman {pagination.page} dari {pagination.total_pages}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.total_pages))}
          disabled={!pagination.has_next || isBusy}
          className="h-8 text-xs rounded-xl px-2.5 cursor-pointer"
        >
          <span>Selanjutnya</span>
          <ChevronRight className="size-3.5 ml-1" />
        </Button>
      </div>
    </div>
  )
})
