"use client"

import * as React from "react"
import type { StudentAssessment } from "@/types/assessment"

interface PrintableStudentHeaderProps {
  assessment: StudentAssessment
}

export function PrintableStudentHeader({ assessment }: PrintableStudentHeaderProps) {
  return (
    <>
      <div className="text-center font-bold mb-3">
        <h2 className="text-sm tracking-wide uppercase">
          DAFTAR PENILAIAN PRAKTIK KERJA LAPANGAN
        </h2>
        <p className="text-xs uppercase">
          DI DUDI {assessment.company_name || "......................................."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 mb-3 text-[11px]">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-28 py-0.5 font-semibold">Nama</td>
              <td className="w-2 py-0.5">:</td>
              <td className="py-0.5">{assessment.student_name}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-semibold">NIS</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5">{assessment.student_nis || "-"}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-semibold">Kelas</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5">{assessment.student_class || "-"}</td>
            </tr>
          </tbody>
        </table>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-28 py-0.5 font-semibold">Asal Sekolah</td>
              <td className="w-2 py-0.5">:</td>
              <td className="py-0.5">{assessment.school_name}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-semibold">Alamat Sekolah</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5">{assessment.school_address}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-semibold">Kompetensi Keahlian</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5 font-bold">{assessment.department_name}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
