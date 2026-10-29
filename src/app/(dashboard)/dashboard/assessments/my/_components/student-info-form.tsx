"use client"

import * as React from "react"
import { Building2 } from "lucide-react"
import { DudiInfoFields } from "./dudi-info-fields"

interface StudentInfoFormProps {
  studentName: string
  departmentName: string
  studentNIS: string
  studentClass: string
  companyName: string
  supervisorName: string
  supervisorNIP: string
  assessmentCity: string
  assessmentDate: string
  isReadOnly: boolean
  onChange: (field: string, val: string) => void
}

export function StudentInfoForm({
  studentName,
  departmentName,
  studentNIS,
  studentClass,
  companyName,
  supervisorName,
  supervisorNIP,
  assessmentCity,
  assessmentDate,
  isReadOnly,
  onChange,
}: StudentInfoFormProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4 print:hidden">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Building2 className="size-4 text-sky-600" />
        <span>Informasi Siswa & Tempat PKL (DUDI)</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Nama Siswa
          </label>
          <input
            type="text"
            disabled
            value={studentName}
            className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Kompetensi Keahlian (Jurusan)
          </label>
          <input
            type="text"
            disabled
            value={departmentName}
            className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Nomor Induk Siswa (NIS)
          </label>
          <input
            type="text"
            disabled={isReadOnly}
            placeholder="Contoh: 12345/001.065"
            value={studentNIS}
            onChange={(e) => onChange("studentNIS", e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Kelas
          </label>
          <input
            type="text"
            disabled={isReadOnly}
            placeholder="Contoh: XII RPL 1"
            value={studentClass}
            onChange={(e) => onChange("studentClass", e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
          />
        </div>

        <DudiInfoFields
          companyName={companyName}
          supervisorName={supervisorName}
          supervisorNIP={supervisorNIP}
          assessmentCity={assessmentCity}
          assessmentDate={assessmentDate}
          isReadOnly={isReadOnly}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
