"use client"

import * as React from "react"

interface PrintableSignatureBlockProps {
  assessmentCity?: string
  formattedDate: string
  supervisorName?: string
  supervisorNIP?: string
}

export function PrintableSignatureBlock({
  assessmentCity,
  formattedDate,
  supervisorName,
  supervisorNIP,
}: PrintableSignatureBlockProps) {
  return (
    <div className="grid grid-cols-2 mt-4 text-[10px] items-start">
      <div>
        <p className="font-bold mb-1">Deskripsi Nilai :</p>
        <p>A = 86 - 100 = Sangat Baik</p>
        <p>B = 71 - 85 = Baik</p>
        <p>C = 56 - 70 = Cukup</p>
        <p>D = 0 - 55 = Kurang</p>
      </div>

      <div className="text-center ml-auto w-64">
        <p>{assessmentCity || "Malang"}, {formattedDate}</p>
        <p className="font-semibold mt-1">Pimpinan Lembaga DUDI,</p>
        <div className="h-14 flex items-center justify-center text-slate-300 text-[9px] italic">
          (Tanda Tangan & Stempel)
        </div>
        <p className="font-bold underline uppercase">
          {supervisorName || "........................................"}
        </p>
        {supervisorNIP ? <p>NIP. {supervisorNIP}</p> : null}
      </div>
    </div>
  )
}
