import type jsPDF from "jspdf"
import autoTable, { type RowInput } from "jspdf-autotable"
import type { StudentAssessment } from "@/types/assessment"
import { calculateGrade } from "./grade-calc"

export function drawPdfTable(doc: jsPDF, assessment: StudentAssessment, startY: number): number {
  const head = [
    [
      { content: "NO.", rowSpan: 2, styles: { halign: "center" as const, valign: "middle" as const } },
      { content: "CAPAIAN SASARAN KERJA", rowSpan: 2, styles: { halign: "center" as const, valign: "middle" as const } },
      { content: "NILAI", colSpan: 3, styles: { halign: "center" as const, valign: "middle" as const } },
      { content: "NO.", rowSpan: 2, styles: { halign: "center" as const, valign: "middle" as const } },
      { content: "PERILAKU KERJA", rowSpan: 2, styles: { halign: "center" as const, valign: "middle" as const } },
      { content: "NILAI", colSpan: 3, styles: { halign: "center" as const, valign: "middle" as const } },
    ],
    [
      { content: "ANGKA", styles: { halign: "center" as const } },
      { content: "HURUF", styles: { halign: "center" as const } },
      { content: "SEBUTAN", styles: { halign: "center" as const } },
      { content: "ANGKA", styles: { halign: "center" as const } },
      { content: "HURUF", styles: { halign: "center" as const } },
      { content: "SEBUTAN", styles: { halign: "center" as const } },
    ],
  ]

  const workItems = assessment.work_aspects || []
  const behItems = assessment.behavior_aspects || []
  const maxRows = Math.max(workItems.length, behItems.length, 5)
  const body: RowInput[] = []

  for (let i = 0; i < maxRows; i++) {
    const row: RowInput = []
    if (i < workItems.length) {
      const w = workItems[i]
      row.push({ content: `${i + 1}.`, styles: { halign: "center" } })
      const title = w.category && w.category !== w.title ? `[${w.category}] ${w.title}` : w.title
      row.push({ content: title })
      row.push({ content: w.score_numeric > 0 ? String(w.score_numeric) : "", styles: { halign: "center" } })
      row.push({ content: w.score_letter && w.score_letter !== "-" ? w.score_letter : "", styles: { halign: "center" } })
      row.push({ content: w.score_predicate && w.score_predicate !== "-" ? w.score_predicate : "", styles: { halign: "center" } })
    } else {
      row.push({ content: "" }, { content: "" }, { content: "" }, { content: "" }, { content: "" })
    }

    if (i < behItems.length) {
      const b = behItems[i]
      row.push({ content: `${i + 1}.`, styles: { halign: "center" } })
      row.push({ content: b.title })
      row.push({ content: b.score_numeric > 0 ? String(b.score_numeric) : "", styles: { halign: "center" } })
      row.push({ content: b.score_letter && b.score_letter !== "-" ? b.score_letter : "", styles: { halign: "center" } })
      row.push({ content: b.score_predicate && b.score_predicate !== "-" ? b.score_predicate : "", styles: { halign: "center" } })
    } else if (i === behItems.length) {
      row.push({
        content: "",
        colSpan: 5,
        rowSpan: maxRows - behItems.length,
        styles: { fillColor: [255, 255, 255] },
      })
    }
    body.push(row)
  }

  const workAvg = assessment.work_average || 0
  const avgGrade = workAvg > 0 ? calculateGrade(workAvg) : { letter: "", predicate: "" }

  body.push([
    { content: "Rerata Nilai Capaian Sasaran Kerja", colSpan: 2, styles: { halign: "center", fontStyle: "bold" } },
    { content: workAvg > 0 ? workAvg.toFixed(2) : "", styles: { halign: "center", fontStyle: "bold" } },
    { content: avgGrade.letter, styles: { halign: "center", fontStyle: "bold" } },
    { content: avgGrade.predicate, styles: { halign: "center", fontStyle: "bold" } },
    { content: "", colSpan: 5, styles: { lineWidth: { top: 0.2, bottom: 0, left: 0, right: 0 } } },
  ])

  autoTable(doc, {
    head,
    body,
    startY,
    margin: { left: 10, right: 10 },
    theme: "plain",
    styles: {
      lineWidth: 0.2,
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
      fontSize: 7,
      cellPadding: 1.2,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      lineWidth: 0.2,
      lineColor: [0, 0, 0],
      fontSize: 7.5,
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 106 },
      2: { cellWidth: 14 },
      3: { cellWidth: 14 },
      4: { cellWidth: 20 },
      5: { cellWidth: 8 },
      6: { cellWidth: 49 },
      7: { cellWidth: 18 },
      8: { cellWidth: 18 },
      9: { cellWidth: 22 },
    },
  })

  const docTable = doc as unknown as { lastAutoTable?: { finalY: number } }
  return (docTable.lastAutoTable?.finalY ?? startY) + 5
}
