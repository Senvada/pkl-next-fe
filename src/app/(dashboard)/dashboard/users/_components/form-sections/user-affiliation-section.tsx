"use client"

import * as React from "react"
import { GraduationCap } from "lucide-react"
import { FormDrawerSection } from "@/components/shared/form-drawer"
import { CompanySelect } from "@/components/shared/company-select"
import type { Department } from "@/types/department"
import type { Company } from "@/types/company"

interface UserAffiliationSectionProps {
  formDeptID: string
  setFormDeptID: (v: string) => void
  formCompanyID: string
  setFormCompanyID: (v: string) => void
  departments: Department[]
  companies: Company[]
  isAdmin: boolean
  isIndustri: boolean
}

export function UserAffiliationSection({
  formDeptID,
  setFormDeptID,
  formCompanyID,
  setFormCompanyID,
  departments,
  isAdmin,
  isIndustri,
}: UserAffiliationSectionProps) {
  return (
    <FormDrawerSection
      step={3}
      title="Afiliasi Jurusan & Industri Mitra"
      description="Hubungkan pengguna dengan program keahlian atau perusahaan tempat magang."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <GraduationCap className="size-3.5 text-emerald-500" />
            <span>Jurusan / Program Keahlian</span>
          </label>
          <select
            value={formDeptID}
            onChange={(e) => setFormDeptID(e.target.value)}
            className="w-full h-9.5 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
          >
            <option value="">Tidak Ditentukan / Umum</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code} - {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Industri / Mitra PKL
          </label>
          <CompanySelect
            value={formCompanyID || null}
            onChange={(val) => setFormCompanyID(val || "")}
            disabled={!isAdmin && isIndustri}
            placeholder="Pilih mitra industri..."
            className="h-9.5 text-xs rounded-xl"
            allowClear
          />
          {!isAdmin && isIndustri && (
            <span className="text-[10px] text-muted-foreground block">
              Terkunci otomatis pada industri Anda
            </span>
          )}
        </div>
      </div>
    </FormDrawerSection>
  )
}
