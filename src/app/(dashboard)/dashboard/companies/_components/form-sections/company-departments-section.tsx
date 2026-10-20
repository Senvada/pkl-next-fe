"use client"

import * as React from "react"
import { FormDrawerSection } from "@/components/shared/form-drawer"
import type { Department } from "@/types/department"

interface CompanyDepartmentsSectionProps {
  departments: Department[]
  selectedDeptIds: string[]
  onDeptToggle: (deptId: string) => void
}

export function CompanyDepartmentsSection({
  departments,
  selectedDeptIds,
  onDeptToggle,
}: CompanyDepartmentsSectionProps) {
  return (
    <FormDrawerSection
      step={4}
      title="Jurusan yang Relevan / Diterima"
      description="Pilih jurusan apa saja yang dapat mendaftar atau magang di mitra ini."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {departments.map((dept) => {
          const checked = selectedDeptIds.includes(dept.id)
          return (
            <label
              key={dept.id}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                checked
                  ? "border-blue-500/40 bg-blue-50/50 dark:bg-blue-900/20 text-slate-900 dark:text-white"
                  : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onDeptToggle(dept.id)}
                className="size-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="truncate font-medium">{dept.name}</span>
                <span
                  className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border"
                  style={{
                    backgroundColor: `${dept.color}15`,
                    borderColor: `${dept.color}40`,
                    color: dept.color,
                  }}
                >
                  {dept.code}
                </span>
              </div>
            </label>
          )
        })}
      </div>
    </FormDrawerSection>
  )
}
