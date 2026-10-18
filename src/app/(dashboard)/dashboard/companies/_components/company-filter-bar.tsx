"use client"

import * as React from "react"
import { Search, X, RotateCcw, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Department } from "@/types/department"

interface CompanyFilterBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterDept: string
  onDeptChange: (value: string) => void
  filterStatus: string
  onStatusChange: (value: string) => void
  limit: number
  onLimitChange: (limit: number) => void
  hasActiveFilters: boolean
  onResetFilters: () => void
  departments: Department[]
}

export const CompanyFilterBar = React.memo(function CompanyFilterBar({
  searchTerm,
  onSearchChange,
  filterDept,
  onDeptChange,
  filterStatus,
  onStatusChange,
  limit,
  onLimitChange,
  hasActiveFilters,
  onResetFilters,
  departments,
}: CompanyFilterBarProps) {
  const [filterExpanded, setFilterExpanded] = React.useState(false)

  const activeCount = React.useMemo(() => {
    let count = 0
    if (filterDept) count++
    if (filterStatus) count++
    return count
  }, [filterDept, filterStatus])

  return (
    <Card className="rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs bg-white dark:bg-[#16212D] overflow-hidden">
      <CardContent className="p-3 sm:p-4 space-y-3">
        {/* Primary Row: Search Bar + Mobile Filter Toggle + Reset */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Cari nama perusahaan, alamat, email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-9 h-10 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-blue-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                aria-label="Hapus pencarian"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFilterExpanded((prev) => !prev)}
            className="md:hidden h-10 px-3 rounded-xl border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 relative shrink-0"
          >
            <SlidersHorizontal className="size-4" />
            {activeCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
            <ChevronDown
              className={`size-3.5 ml-1 transition-transform duration-200 ${
                filterExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-10 px-3 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl shrink-0"
              title="Reset semua filter"
            >
              <RotateCcw className="size-3.5 mr-1.5" />
              Reset
            </Button>
          )}
        </div>

        {/* Secondary Row: Dropdowns (Always on Desktop, Collapsible on Mobile) */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 border-t border-slate-100 dark:border-white/5 md:grid ${
            filterExpanded ? "grid" : "hidden md:grid"
          }`}
        >
          {/* Department Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Jurusan Terkait
            </label>
            <select
              value={filterDept}
              onChange={(e) => onDeptChange(e.target.value)}
              className="h-9.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Semua Jurusan</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Status Mitra
            </label>
            <select
              value={filterStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-9.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>

          {/* Rows Limit */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Jumlah Per Halaman
            </label>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-9.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value={10}>10 data</option>
              <option value={25}>25 data</option>
              <option value={50}>50 data</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
