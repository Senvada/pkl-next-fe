import type jsPDF from "jspdf"
import type { StudentAssessment } from "@/types/assessment"

export function drawPdfFooter(doc: jsPDF, assessment: StudentAssessment, startY: number): void {
  // Left: Deskripsi Nilai
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.text("Deskripsi Nilai :", 10, startY)
  doc.text("A  =  86 - 100  =  Sangat Baik", 10, startY + 4.2)
  doc.text("B  =  71 - 85    =  Baik", 10, startY + 8.4)
  doc.text("C  =  56 - 70    =  Cukup", 10, startY + 12.6)
  doc.text("D  =    0 - 55    =  Kurang", 10, startY + 16.8)

  // Right: Signature Block
  const sigX = 220
  const city = assessment.assessment_city || "......................."
  let dateStr = "..............................."
  if (assessment.assessment_date) {
    try {
      dateStr = new Date(assessment.assessment_date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch {
      dateStr = assessment.assessment_date
    }
  }

  doc.text(`${city}, ${dateStr}`, sigX, startY)
  doc.text("Pimpinan Lembaga DUDI,", sigX, startY + 4.5)

  if (assessment.supervisor_name) {
    doc.setFont("helvetica", "bold")
    doc.text(assessment.supervisor_name, sigX, startY + 22)
    doc.setFont("helvetica", "normal")
    if (assessment.supervisor_nip) {
      doc.text(`NIP. ${assessment.supervisor_nip}`, sigX, startY + 26)
      doc.text("Nama, Tanda Tangan, dan Stempel", sigX, startY + 30)
    } else {
      doc.text("Nama, Tanda Tangan, dan Stempel", sigX, startY + 26)
    }
  } else {
    doc.text("Nama, Tanda Tangan, dan Stempel", sigX, startY + 22)
  }
}
