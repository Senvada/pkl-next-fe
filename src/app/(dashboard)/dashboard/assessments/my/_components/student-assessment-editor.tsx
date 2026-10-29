"use client"

import * as React from "react"
import { useUpsertStudentAssessment } from "@/hooks/modules/assessment"
import type {
  StudentAssessment,
  WorkAspectItem,
  BehaviorAspectItem,
} from "@/types/assessment"
import { calculateGrade } from "@/lib/assessment/grade-calc"
import { generateAssessmentPDF } from "@/lib/assessment/generate-pdf"
import { StudentAssessmentHeader } from "./student-assessment-header"
import { StudentInfoForm } from "./student-info-form"
import { TechnicalAspectsCard } from "./technical-aspects-card"
import { BehaviorAspectsCard } from "./behavior-aspects-card"
import { AssessmentSummaryCard } from "./assessment-summary-card"

interface StudentAssessmentEditorProps {
  initialData: StudentAssessment
}

export function StudentAssessmentEditor({ initialData }: StudentAssessmentEditorProps) {
  const upsertMutation = useUpsertStudentAssessment()

  const [form, setForm] = React.useState({
    studentNIS: initialData.student_nis || "",
    studentClass: initialData.student_class || "",
    companyName: initialData.company_name || "",
    supervisorName: initialData.supervisor_name || "",
    supervisorNIP: initialData.supervisor_nip || "",
    assessmentCity: initialData.assessment_city || "Malang",
    assessmentDate: initialData.assessment_date || new Date().toISOString().split("T")[0],
  })

  const [workAspects, setWorkAspects] = React.useState<WorkAspectItem[]>(
    initialData.work_aspects || []
  )
  const [behaviorAspects, setBehaviorAspects] = React.useState<BehaviorAspectItem[]>(
    initialData.behavior_aspects || []
  )

  const isReadOnly = initialData.status === "verified"

  const handleWorkScore = (idx: number, score: number) => {
    const next = [...workAspects]
    const { letter, predicate } = calculateGrade(score)
    next[idx] = { ...next[idx], score_numeric: score, score_letter: letter, score_predicate: predicate }
    setWorkAspects(next)
  }

  const handleBehScore = (idx: number, score: number) => {
    const next = [...behaviorAspects]
    const { letter, predicate } = calculateGrade(score)
    next[idx] = { ...next[idx], score_numeric: score, score_letter: letter, score_predicate: predicate }
    setBehaviorAspects(next)
  }

  const handleAddCustomWork = () => {
    setWorkAspects([
      ...workAspects,
      { id: crypto.randomUUID(), title: "", is_custom: true, score_numeric: 0, score_letter: "-", score_predicate: "-" },
    ])
  }

  const validWork = workAspects.filter((w) => w.score_numeric > 0)
  const workAvg = validWork.length > 0 ? validWork.reduce((a, b) => a + b.score_numeric, 0) / validWork.length : 0
  const validBeh = behaviorAspects.filter((b) => b.score_numeric > 0)
  const behAvg = validBeh.length > 0 ? validBeh.reduce((a, b) => a + b.score_numeric, 0) / validBeh.length : 0
  const overallAvg = validWork.length > 0 && validBeh.length > 0 ? (workAvg + behAvg) / 2 : (workAvg || behAvg)
  const { letter: ovLetter, predicate: ovPred } = calculateGrade(overallAvg)

  const handleSave = async (status: "draft" | "submitted") => {
    await upsertMutation.mutateAsync({
      period_id: initialData.period_id,
      company_id: initialData.company_id,
      student_nis: form.studentNIS,
      student_class: form.studentClass,
      company_name: form.companyName,
      supervisor_name: form.supervisorName,
      supervisor_nip: form.supervisorNIP,
      assessment_city: form.assessmentCity,
      assessment_date: form.assessmentDate,
      work_aspects: workAspects,
      behavior_aspects: behaviorAspects,
      status,
    })
  }

  const currentAssessment: StudentAssessment = {
    ...initialData,
    ...form,
    work_aspects: workAspects,
    behavior_aspects: behaviorAspects,
    work_average: workAvg,
    behavior_average: behAvg,
    overall_average: overallAvg,
  }

  return (
    <>
      <StudentAssessmentHeader
        status={initialData.status}
        isSaving={upsertMutation.isPending}
        isReadOnly={isReadOnly}
        onSave={handleSave}
        onPrint={() => generateAssessmentPDF(currentAssessment)}
      />

      <StudentInfoForm
        studentName={initialData.student_name}
        departmentName={initialData.department_name}
        {...form}
        isReadOnly={isReadOnly}
        onChange={(k, v) => setForm((prev) => ({ ...prev, [k]: v }))}
      />

      <TechnicalAspectsCard
        workAspects={workAspects}
        isReadOnly={isReadOnly}
        onAddCustomWork={handleAddCustomWork}
        onScoreChange={handleWorkScore}
        onTitleChange={(idx, t) => {
          const next = [...workAspects]
          next[idx].title = t
          setWorkAspects(next)
        }}
        onDelete={(idx) => setWorkAspects(workAspects.filter((_, i) => i !== idx))}
      />

      <BehaviorAspectsCard
        behaviorAspects={behaviorAspects}
        isReadOnly={isReadOnly}
        onScoreChange={handleBehScore}
      />

      <AssessmentSummaryCard
        workAverage={workAvg}
        behaviorAverage={behAvg}
        overallAverage={overallAvg}
        overallLetter={ovLetter}
        overallPredicate={ovPred}
      />
    </>
  )
}
