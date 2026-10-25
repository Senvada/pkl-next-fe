"use client"

import * as React from "react"
import { GraduationCap, UserCheck } from "lucide-react"
import { FormDrawerSection } from "@/components/shared/form-drawer"
import { CompanySelect } from "@/components/shared/company-select"
import { UserSelect } from "@/components/shared/user-select"
import type { Department } from "@/types/department"

interface UserAffiliationSectionProps {
  formDeptID: string
  setFormDeptID: (v: string) => void
  formDeptIDs: string[]
  setFormDeptIDs: React.Dispatch<React.SetStateAction<string[]>>
  isMultiDeptRole: boolean
  isStudentRole?: boolean
  formCompanyID: string
  setFormCompanyID: (v: string) => void
  formParentID: string
  setFormParentID: (v: string) => void
  formParentName: string
  setFormParentName: (v: string) => void
  departments: Department[]
  isAdmin: boolean
  isIndustri: boolean
}

export function UserAffiliationSection({
  formDeptID, setFormDeptID, formDeptIDs, setFormDeptIDs, isMultiDeptRole, isStudentRole = false,
  formCompanyID, setFormCompanyID, formParentID, setFormParentID, formParentName, setFormParentName,
  departments, isAdmin, isIndustri,
}: UserAffiliationSectionProps) {
  const toggleDepartment = (deptId: string) => {
    setFormDeptIDs((prev) => prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId])
  }

  return (
    <FormDrawerSection step={3} title="Afiliasi Jurusan & Industri Mitra" description="Hubungkan pengguna dengan program keahlian atau perusahaan tempat magang.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5"><GraduationCap className="size-3.5 text-emerald-500" /><span>Jurusan</span></span>
            {isMultiDeptRole && <span className="text-[10px] text-muted-foreground font-normal">Pilih &gt;1 jurusan</span>}
          </label>
          {isMultiDeptRole ? (
            <div className="border border-input rounded-xl p-2.5 space-y-1.5 max-h-40 overflow-y-auto bg-muted/20">
              {departments.length === 0 ? <p className="text-[11px] text-muted-foreground">Tidak ada jurusan tersedia.</p> : (
                departments.map((d) => {
                  const isChecked = formDeptIDs.includes(d.id)
                  return (
                    <label key={d.id} className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${isChecked ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/40 text-foreground"}`}>
                      <input type="checkbox" checked={isChecked} onChange={() => toggleDepartment(d.id)} className="rounded border-input text-primary focus:ring-primary size-3.5 cursor-pointer" />
                      <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: d.color || "#3B82F6" }} />
                      <span className="truncate">{d.code} - {d.name}</span>
                    </label>
                  )
                })
              )}
            </div>
          ) : (
            <select value={formDeptID} onChange={(e) => setFormDeptID(e.target.value)} className="w-full h-9.5 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring">
              <option value="">Tidak Ditentukan / Umum</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.code} - {d.name}</option>)}
            </select>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Industri / Mitra PKL</label>
          <CompanySelect value={formCompanyID || null} onChange={(val) => setFormCompanyID(val || "")} disabled={!isAdmin && isIndustri} placeholder="Pilih mitra industri..." className="h-9.5 text-xs rounded-xl" allowClear />
          {!isAdmin && isIndustri && <span className="text-[10px] text-muted-foreground block">Terkunci otomatis pada industri Anda</span>}
        </div>

        {(isStudentRole || Boolean(formParentID)) && (
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <UserCheck className="size-3.5 text-blue-500" />
              <span>Guru / Pembimbing PKL</span>
            </label>
            <UserSelect
              value={formParentID || null}
              selectedLabel={formParentName}
              onChange={(val, u) => {
                setFormParentID(val || "")
                setFormParentName(u?.name || "")
              }}
              placeholder="Pilih pembimbing siswa..."
              className="h-9.5 text-xs rounded-xl"
              allowClear
            />
            <span className="text-[10px] text-muted-foreground block">
              Bind siswa ini ke akun guru atau pembimbing PKL.
            </span>
          </div>
        )}
      </div>
    </FormDrawerSection>
  )
}
