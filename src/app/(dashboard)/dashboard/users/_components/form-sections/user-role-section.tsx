"use client"

import * as React from "react"
import { ShieldCheck } from "lucide-react"
import { FormDrawerSection } from "@/components/shared/form-drawer"
import type { Role } from "@/types/role"

interface UserRoleSectionProps {
  formRoleID: string
  setFormRoleID: (v: string) => void
  formStatus: string
  setFormStatus: (v: string) => void
  roles: Role[]
}

export function UserRoleSection({
  formRoleID,
  setFormRoleID,
  formStatus,
  setFormStatus,
  roles,
}: UserRoleSectionProps) {
  return (
    <FormDrawerSection
      step={2}
      title="Otorisasi & Status Akun"
      description="Menentukan batasan izin akses modul dan status keaktifan akun di sistem."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-blue-500" />
            <span>Role / Hak Akses</span>
            <span className="text-destructive">*</span>
          </label>
          <select
            value={formRoleID}
            onChange={(e) => setFormRoleID(e.target.value)}
            className="w-full h-9.5 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
            required
          >
            <option value="" disabled>Pilih Role Pengguna</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Status Keaktifan
          </label>
          <select
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value)}
            className="w-full h-9.5 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
          >
            <option value="active">Aktif (Dapat Masuk)</option>
            <option value="waiting">Menunggu Verifikasi</option>
            <option value="inactive">Nonaktif</option>
            <option value="banned">Diblokir / Ditangguhkan</option>
          </select>
        </div>
      </div>
    </FormDrawerSection>
  )
}
