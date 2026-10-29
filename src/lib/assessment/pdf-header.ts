import type jsPDF from "jspdf"
import type { StudentAssessment } from "@/types/assessment"

export function drawPdfHeader(doc: jsPDF, assessment: StudentAssessment): number {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)

  // Title centered
  doc.text("DAFTAR PENILAIAN PRAKTIK KERJA LAPANGAN", 148.5, 12, { align: "center" })
  const dudiText = assessment.company_name
    ? `DI DUDI ${assessment.company_name.toUpperCase()}`
    : "DI DUDI ..................................................."
  doc.text(dudiText, 148.5, 17.5, { align: "center" })

  // Student & School Info (indented block on left)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)

  const infoX = 40
  const colonX = 75
  const valX = 78

  const studentName = assessment.student_name || "..................................................."
  const studentNIS = assessment.student_nis || "..................................................."
  const studentClass = assessment.student_class || "..................................................."
  const schoolName = assessment.school_name || "SMK Negeri 6 Malang"
  const schoolAddr = assessment.school_address || "Jl. Ki Ageng Gribig 28 Malang"
  const schoolPhone = assessment.school_phone || "(0341) 722216"
  const schoolEmail = assessment.school_email || "humas@smkn6malang.sch.id"
  const deptName = assessment.department_name || "..................................................."

  const metaRows: [string, string][] = [
    ["Nama", studentName],
    ["NIS", studentNIS],
    ["Kelas", studentClass],
    ["Asal Sekolah", schoolName],
    ["Alamat Sekolah", schoolAddr],
    ["", `Telp. ${schoolPhone}   E-mail : ${schoolEmail}`],
    ["Kompetensi Keahlian", deptName],
  ]

  let curY = 23
  for (const [label, val] of metaRows) {
    if (label) {
      doc.text(label, infoX, curY)
      doc.text(":", colonX, curY)
    }
    doc.text(val, valX, curY)
    curY += 4.2
  }

  return curY + 2
}
