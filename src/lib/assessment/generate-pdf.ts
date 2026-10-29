import jsPDF from "jspdf"
import type { StudentAssessment } from "@/types/assessment"
import { drawPdfHeader } from "./pdf-header"
import { drawPdfTable } from "./pdf-table"
import { drawPdfFooter } from "./pdf-footer"

export function generateAssessmentPDF(assessment: StudentAssessment): void {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  // 1. Header (Title + Kop Info)
  const tableStartY = drawPdfHeader(doc, assessment)

  // 2. Body Table (Unified side-by-side Technical and Behavior aspects)
  const footerStartY = drawPdfTable(doc, assessment, tableStartY)

  // 3. Footer (Grade description + DUDI Signature)
  drawPdfFooter(doc, assessment, footerStartY)

  // 4. Download file directly on client
  const safeName = (assessment.student_name || "Siswa").replace(/[^a-zA-Z0-9_-]/g, "_")
  const safeNis = (assessment.student_nis || "NIS").replace(/[^a-zA-Z0-9_-]/g, "_")
  const filename = `Daftar_Nilai_PKL_${safeNis}_${safeName}.pdf`

  doc.save(filename)
}
