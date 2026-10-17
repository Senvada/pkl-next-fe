import * as React from "react"
import { Search, X, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Role } from "@/types/role"
import type { Department } from "@/types/department"
import type { Company } from "@/types/company"

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
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card/60">
      <CardContent className="p-3 sm:p-3.5 space-y-2.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama pengguna atau email..."
              className="h-8.5 text-xs pl-8.5 rounded-xl bg-background"
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

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="h-8.5 text-xs rounded-xl border border-input bg-background px-2.5 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
            >
              <option value="all">Semua Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <select
              value={filterDept}
              onChange={(e) => onDeptChange(e.target.value)}
              className="h-8.5 text-xs rounded-xl border border-input bg-background px-2.5 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
            >
              <option value="all">Semua Jurusan</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
              ))}
            </select>

            {isAdmin && (
              <select
                value={filterCompany}
                onChange={(e) => onCompanyChange(e.target.value)}
                className="h-8.5 text-xs rounded-xl border border-input bg-background px-2.5 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring max-w-[160px] truncate"
              >
                <option value="all">Semua Industri</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}

            <select
              value={filterStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-8.5 text-xs rounded-xl border border-input bg-background px-2.5 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="waiting">Menunggu</option>
              <option value="inactive">Nonaktif</option>
              <option value="banned">Diblokir</option>
            </select>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className="h-8.5 text-xs px-2.5 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer gap-1"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
