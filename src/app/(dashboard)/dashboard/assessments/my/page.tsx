"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { useMyStudentAssessmentQuery } from "@/hooks/modules/assessment"
import { StudentAssessmentEditor } from "./_components/student-assessment-editor"

export default function MyStudentAssessmentPage() {
  const { data, isLoading } = useMyStudentAssessmentQuery()

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-sky-600 mb-2" />
        <p className="text-sm text-slate-500">Memuat formulir penilaian PKL...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <StudentAssessmentEditor
        key={data.id || data.period_id}
        initialData={data}
      />
    </div>
  )
}
