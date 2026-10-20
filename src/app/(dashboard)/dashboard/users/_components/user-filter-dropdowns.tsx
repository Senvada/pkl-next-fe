import * as React from "react"
import type { Role } from "@/types/role"
import type { Department } from "@/types/department"
import type { Company } from "@/types/company"

interface UserFilterDropdownsProps {
  filterRole: string
  onRoleChange: (value: string) => void
  filterDept: string
  onDeptChange: (value: string) => void
  filterCompany: string
  onCompanyChange: (value: string) => void
  filterStatus: string
  onStatusChange: (value: string) => void
  roles: Role[]
  departments: Department[]
  companies: Company[]
  isAdmin: boolean
}

export function UserFilterDropdowns({
  filterRole,
  onRoleChange,
  filterDept,
  onDeptChange,
  filterCompany,
  onCompanyChange,
  filterStatus,
  onStatusChange,
  roles,
  departments,
  companies,
  isAdmin,
}: UserFilterDropdownsProps) {
  return (
    <div className="pt-2.5 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-2.5 animate-in fade-in-50 duration-150">
      <FilterSelect label="Peran / Role" value={filterRole} onChange={onRoleChange}>
        <option value="all">Semua Role</option>
        {roles.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
      </FilterSelect>

      <FilterSelect label="Jurusan / Keahlian" value={filterDept} onChange={onDeptChange}>
        <option value="all">Semua Jurusan</option>
        {departments.map((d) => (<option key={d.id} value={d.id}>{d.code} - {d.name}</option>))}
      </FilterSelect>

      {isAdmin && (
        <FilterSelect label="Mitra Industri" value={filterCompany} onChange={onCompanyChange}>
          <option value="all">Semua Industri</option>
          {companies.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </FilterSelect>
      )}

      <FilterSelect label="Status Akun" value={filterStatus} onChange={onStatusChange}>
        <option value="all">Semua Status</option>
        <option value="active">Aktif</option>
        <option value="waiting">Menunggu</option>
        <option value="inactive">Nonaktif</option>
        <option value="banned">Diblokir</option>
      </FilterSelect>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-medium text-muted-foreground block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 text-xs rounded-lg border border-input bg-background px-2.5 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring truncate"
      >{children}</select>
    </div>
  )
}
