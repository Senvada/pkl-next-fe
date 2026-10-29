"use client"

import * as React from "react"
import type { StudentAssessment } from "@/types/assessment"
import { PrintableStudentHeader } from "./printable-student-header"
import { PrintableSignatureBlock } from "./printable-signature-block"

interface AssessmentPrintableViewProps {
  assessment: StudentAssessment
}

export function AssessmentPrintableView({ assessment }: AssessmentPrintableViewProps) {
  const formattedDate = assessment.assessment_date
    ? new Date(assessment.assessment_date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "........................"

  return (
    <div className="block text-black bg-white p-4 font-sans text-[11px] leading-snug rounded-lg">
      <PrintableStudentHeader assessment={assessment} />

      <div className="grid grid-cols-12 gap-3 mb-2">
        <div className="col-span-7">
          <table className="w-full border-collapse border border-black text-[10px]">
            <thead>
              <tr className="bg-slate-100 text-center font-bold">
                <th className="border border-black p-1 w-6" rowSpan={2}>NO.</th>
                <th className="border border-black p-1 text-left" rowSpan={2}>CAPAIAN SASARAN KERJA</th>
                <th className="border border-black p-1" colSpan={3}>NILAI</th>
              </tr>
              <tr className="bg-slate-100 text-center font-bold">
                <th className="border border-black p-0.5 w-10">ANGKA</th>
                <th className="border border-black p-0.5 w-8">HURUF</th>
                <th className="border border-black p-0.5 w-14">SEBUTAN</th>
              </tr>
            </thead>
            <tbody>
              {assessment.work_aspects?.map((w, idx) => (
                <tr key={w.id || idx}>
                  <td className="border border-black p-1 text-center font-semibold">{idx + 1}.</td>
                  <td className="border border-black p-1">
                    {w.category ? <strong>[{w.category}] </strong> : null}
                    {w.title}
                  </td>
                  <td className="border border-black p-1 text-center font-bold">{w.score_numeric || "-"}</td>
                  <td className="border border-black p-1 text-center font-bold">{w.score_letter || "-"}</td>
                  <td className="border border-black p-1 text-center">{w.score_predicate || "-"}</td>
                </tr>
              ))}
              <tr className="font-bold bg-slate-50">
                <td className="border border-black p-1 text-right" colSpan={2}>
                  Rerata Nilai Capaian Sasaran Kerja
                </td>
                <td className="border border-black p-1 text-center font-black">
                  {assessment.work_average ? assessment.work_average.toFixed(2) : "-"}
                </td>
                <td className="border border-black p-1" colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-span-5">
          <table className="w-full border-collapse border border-black text-[10px]">
            <thead>
              <tr className="bg-slate-100 text-center font-bold">
                <th className="border border-black p-1 w-6" rowSpan={2}>NO.</th>
                <th className="border border-black p-1 text-left" rowSpan={2}>PERILAKU KERJA</th>
                <th className="border border-black p-1" colSpan={3}>NILAI</th>
              </tr>
              <tr className="bg-slate-100 text-center font-bold">
                <th className="border border-black p-0.5 w-10">ANGKA</th>
                <th className="border border-black p-0.5 w-8">HURUF</th>
                <th className="border border-black p-0.5 w-14">SEBUTAN</th>
              </tr>
            </thead>
            <tbody>
              {assessment.behavior_aspects?.map((b, idx) => (
                <tr key={b.id || idx}>
                  <td className="border border-black p-1 text-center font-semibold">{idx + 1}.</td>
                  <td className="border border-black p-1 font-medium">{b.title}</td>
                  <td className="border border-black p-1 text-center font-bold">{b.score_numeric || "-"}</td>
                  <td className="border border-black p-1 text-center font-bold">{b.score_letter || "-"}</td>
                  <td className="border border-black p-1 text-center">{b.score_predicate || "-"}</td>
                </tr>
              ))}
              <tr className="font-bold bg-slate-50">
                <td className="border border-black p-1 text-right" colSpan={2}>
                  Rerata Perilaku Kerja
                </td>
                <td className="border border-black p-1 text-center font-black">
                  {assessment.behavior_average ? assessment.behavior_average.toFixed(2) : "-"}
                </td>
                <td className="border border-black p-1" colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <PrintableSignatureBlock
        assessmentCity={assessment.assessment_city}
        formattedDate={formattedDate}
        supervisorName={assessment.supervisor_name}
        supervisorNIP={assessment.supervisor_nip}
      />
    </div>
  )
}
