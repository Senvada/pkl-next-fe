import * as React from "react"
import { Search, X, RotateCcw, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Role } from "@/types/role"
import type { Department } from "@/types/department"
import type { Company } from "@/types/company"
import { UserFilterDropdowns } from "./user-filter-dropdowns"

interface UserFilterBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterRole: string
  onRoleChange: (value: string) => void
  filterDept: string
  onDeptChange: (value: string) => void
  filterCompany: string
  onCompanyChange: (value: string) => void
  filterStatus: string
  onStatusChange: (value: string) => void
  hasActiveFilters: boolean
  onResetFilters: () => void
  roles: Role[]
  departments: Department[]
  companies: Company[]
  isAdmin: boolean
}

export const UserFilterBar = React.memo(function UserFilterBar({
  searchTerm,
  onSearchChange,
  filterRole,
  onRoleChange,
  filterDept,
  onDeptChange,
  filterCompany,
  onCompanyChange,
  filterStatus,
  onStatusChange,
  hasActiveFilters,
  onResetFilters,
  roles,
  departments,
  companies,
  isAdmin,
}: UserFilterBarProps) {
  const [filterExpanded, setFilterExpanded] = React.useState(false)

  const activeCount = React.useMemo(() => {
    let count = 0
    if (filterRole !== "all") count++
    if (filterDept !== "all") count++
    if (filterCompany !== "all") count++
    if (filterStatus !== "all") count++
    return count
  }, [filterRole, filterDept, filterCompany, filterStatus])

  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card/60 overflow-hidden">
      <CardContent className="p-3 sm:p-3.5 space-y-3">
        <div className="flex items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama pengguna atau email..."
              className="h-9 text-xs pl-8.5 rounded-xl bg-background"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              variant={filterExpanded || activeCount > 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterExpanded((prev) => !prev)}
              className="h-9 text-xs px-3 rounded-xl gap-1.5 cursor-pointer font-medium"
            >
              <SlidersHorizontal className="size-3.5" />
              <span>Filter</span>
              {activeCount > 0 && (
                <span className="size-4.5 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center">
                  {activeCount}
                </span>
              )}
              <ChevronDown className={`size-3.5 transition-transform duration-150 ${filterExpanded ? "rotate-180" : ""}`} />
            </Button>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className="h-9 text-xs px-2.5 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer gap-1"
                title="Reset Semua Filter"
              >
                <RotateCcw className="size-3" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}
          </div>
        </div>

        {filterExpanded && (
          <UserFilterDropdowns
            filterRole={filterRole}
            onRoleChange={onRoleChange}
            filterDept={filterDept}
            onDeptChange={onDeptChange}
            filterCompany={filterCompany}
            onCompanyChange={onCompanyChange}
            filterStatus={filterStatus}
            onStatusChange={onStatusChange}
            roles={roles}
            departments={departments}
            companies={companies}
            isAdmin={isAdmin}
          />
        )}
      </CardContent>
    </Card>
  )
})
