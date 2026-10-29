"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import {
  useAcademicPeriodsQuery,
  useStudentAssessmentsListQuery,
} from "@/hooks/modules/assessment"
import type { StudentAssessment } from "@/types/assessment"
import { AssessmentListHeader } from "./_components/assessment-list-header"
import { AssessmentListTable } from "./_components/assessment-list-table"
import { AssessmentDetailModal } from "./_components/assessment-detail-modal"

export default function StudentAssessmentsListPage() {
  const { data: periods = [] } = useAcademicPeriodsQuery()
  const [selectedPeriodId, setSelectedPeriodId] = React.useState<string>("")
  const [searchTerm, setSearchTerm] = React.useState<string>("")
  const [selectedAssessment, setSelectedAssessment] = React.useState<StudentAssessment | null>(null)

  const { data: assessments = [], isLoading } = useStudentAssessmentsListQuery(
    selectedPeriodId || undefined,
    undefined,
    searchTerm
  )

  return (
    <div className="container max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <AssessmentListHeader
        periods={periods}
        selectedPeriodId={selectedPeriodId}
        searchTerm={searchTerm}
        onPeriodChange={setSelectedPeriodId}
        onSearchChange={setSearchTerm}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-sky-600 mb-2" />
          <p className="text-sm text-slate-500">Memuat rekap penilaian siswa...</p>
        </div>
      ) : (
        <AssessmentListTable
          assessments={assessments}
          onSelect={setSelectedAssessment}
        />
      )}

      <AssessmentDetailModal
        assessment={selectedAssessment}
        isOpen={!!selectedAssessment}
        onClose={() => setSelectedAssessment(null)}
      />
    </div>
  )
}
