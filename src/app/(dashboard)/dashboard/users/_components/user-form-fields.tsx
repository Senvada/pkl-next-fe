import * as React from "react"
import { Input } from "@/components/ui/input"
import type { Role } from "@/types/role"
import type { Department } from "@/types/department"
import type { Company } from "@/types/company"

interface UserFormFieldsProps {
  formName: string
  setFormName: (v: string) => void
  formEmail: string
  setFormEmail: (v: string) => void
  formPassword: string
  setFormPassword: (v: string) => void
  formRoleID: string
  setFormRoleID: (v: string) => void
  formDeptID: string
  setFormDeptID: (v: string) => void
  formCompanyID: string
  setFormCompanyID: (v: string) => void
  formStatus: string
  setFormStatus: (v: string) => void
  editing: boolean
  roles: Role[]
  departments: Department[]
  companies: Company[]
  isAdmin: boolean
  isIndustri: boolean
}

export const UserFormFields = React.memo(function UserFormFields({
  formName,
  setFormName,
  formEmail,
  setFormEmail,
  formPassword,
  setFormPassword,
  formRoleID,
  setFormRoleID,
  formDeptID,
  setFormDeptID,
  formCompanyID,
  setFormCompanyID,
  formStatus,
  setFormStatus,
  editing,
  roles,
  departments,
  companies,
  isAdmin,
  isIndustri,
}: UserFormFieldsProps) {
  return (
    <div className="space-y-3.5 py-4">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">
          Nama Lengkap <span className="text-destructive">*</span>
        </label>
        <Input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Contoh: Budi Santoso"
          className="h-9 text-xs rounded-xl"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">
          Alamat Email <span className="text-destructive">*</span>
        </label>
        <Input
          type="email"
          value={formEmail}
          onChange={(e) => setFormEmail(e.target.value)}
          placeholder="nama@smkn6malang.sch.id"
          className="h-9 text-xs rounded-xl"
          required
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground">
            Kata Sandi {!editing && <span className="text-destructive">*</span>}
          </label>
          {editing && <span className="text-[10px] text-muted-foreground">Kosongkan jika tidak diubah</span>}
        </div>
        <Input
          type="password"
          value={formPassword}
          onChange={(e) => setFormPassword(e.target.value)}
          placeholder={editing ? "••••••••" : "Minimal 6 karakter"}
          className="h-9 text-xs rounded-xl"
          required={!editing}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">
            Role / Hak Akses <span className="text-destructive">*</span>
          </label>
          <select
            value={formRoleID}
            onChange={(e) => setFormRoleID(e.target.value)}
            className="w-full h-9 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
            required
          >
            <option value="" disabled>Pilih Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Jurusan Siswa</label>
          <select
            value={formDeptID}
            onChange={(e) => setFormDeptID(e.target.value)}
            className="w-full h-9 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
          >
            <option value="">Tidak Ditentukan / Umum</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Industri / Mitra PKL</label>
          <select
            value={formCompanyID}
            onChange={(e) => setFormCompanyID(e.target.value)}
            disabled={!isAdmin && isIndustri}
            className="w-full h-9 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring disabled:opacity-60"
          >
            <option value="">Tidak Ditautkan</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {!isAdmin && isIndustri && (
            <span className="text-[10px] text-muted-foreground block">Terkunci pada industri Anda</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Status Akun</label>
          <select
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value)}
            className="w-full h-9 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
          >
            <option value="active">Aktif</option>
            <option value="waiting">Menunggu</option>
            <option value="inactive">Nonaktif</option>
            <option value="banned">Diblokir</option>
          </select>
        </div>
      </div>
    </div>
  )
})
