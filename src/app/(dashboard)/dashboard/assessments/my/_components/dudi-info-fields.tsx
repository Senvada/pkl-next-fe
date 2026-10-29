"use client"

import * as React from "react"

interface DudiInfoFieldsProps {
  companyName: string
  supervisorName: string
  supervisorNIP: string
  assessmentCity: string
  assessmentDate: string
  isReadOnly: boolean
  onChange: (field: string, val: string) => void
}

export function DudiInfoFields({
  companyName,
  supervisorName,
  supervisorNIP,
  assessmentCity,
  assessmentDate,
  isReadOnly,
  onChange,
}: DudiInfoFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
          Nama Lembaga / Perusahaan DUDI
        </label>
        <input
          type="text"
          required
          disabled={isReadOnly}
          placeholder="Nama Perusahaan tempat PKL"
          value={companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
          Nama Pimpinan / Pembimbing DUDI
        </label>
        <input
          type="text"
          required
          disabled={isReadOnly}
          placeholder="Nama lengkap pimpinan / pembimbing"
          value={supervisorName}
          onChange={(e) => onChange("supervisorName", e.target.value)}
          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
          NIP / Identitas Pembimbing (Opsional)
        </label>
        <input
          type="text"
          disabled={isReadOnly}
          placeholder="NIP / No Identitas"
          value={supervisorNIP}
          onChange={(e) => onChange("supervisorNIP", e.target.value)}
          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Kota Penilaian
          </label>
          <input
            type="text"
            disabled={isReadOnly}
            value={assessmentCity}
            onChange={(e) => onChange("assessmentCity", e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Tanggal Penilaian
          </label>
          <input
            type="date"
            disabled={isReadOnly}
            value={assessmentDate}
            onChange={(e) => onChange("assessmentDate", e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
          />
        </div>
      </div>
    </>
  )
}
