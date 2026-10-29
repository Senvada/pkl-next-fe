"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import {
  useAcademicPeriodsQuery,
  useCreateAcademicPeriod,
  useAssessmentTemplatesQuery,
  useUpdateAssessmentTemplate,
} from "@/hooks/modules/assessment"
import type { AssessmentTemplate } from "@/types/assessment"
import { TemplateHeader } from "./_components/template-header"
import { TemplateCard } from "./_components/template-card"
import { TemplateEditDialog } from "./_components/template-edit-dialog"
import { PeriodCreateDialog } from "./_components/period-create-dialog"

export default function AssessmentTemplatesPage() {
  const { data: periods = [], isLoading: isPeriodsLoading } = useAcademicPeriodsQuery()
  const [selectedPeriodId, setSelectedPeriodId] = React.useState<string>("")
  const [editingTemplate, setEditingTemplate] = React.useState<AssessmentTemplate | null>(null)
  const [isPeriodModalOpen, setIsPeriodModalOpen] = React.useState(false)

  const effectivePeriodId = React.useMemo(() => {
    if (selectedPeriodId) return selectedPeriodId
    const active = periods.find((p) => p.is_active) || periods[0]
    return active?.id || ""
  }, [periods, selectedPeriodId])

  const { data: templates = [], isLoading: isTemplatesLoading } = useAssessmentTemplatesQuery(
    effectivePeriodId || undefined
  )

  const updateTemplateMutation = useUpdateAssessmentTemplate()
  const createPeriodMutation = useCreateAcademicPeriod()

  const handleSaveTemplate = async (payload: {
    title: string
    work_aspects: AssessmentTemplate["work_aspects"]
    behavior_aspects: AssessmentTemplate["behavior_aspects"]
  }) => {
    if (!editingTemplate) return
    await updateTemplateMutation.mutateAsync({
      id: editingTemplate.id,
      payload,
    })
  }

  const handleCreatePeriod = async (payload: {
    name: string
    is_active?: boolean
    copy_from_id?: string
  }) => {
    const res = await createPeriodMutation.mutateAsync(payload)
    if (res?.id) {
      setSelectedPeriodId(res.id)
    }
  }

  const isLoading = isPeriodsLoading || isTemplatesLoading

  return (
    <div className="container max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <TemplateHeader
        periods={periods}
        selectedPeriodId={effectivePeriodId}
        onPeriodChange={setSelectedPeriodId}
        onOpenCreatePeriod={() => setIsPeriodModalOpen(true)}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-sky-600 mb-2" />
          <p className="text-sm text-slate-500">Memuat template penilaian...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-8">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
            Tidak ada template penilaian untuk periode ini.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Silakan buat atau salin template indikator untuk jurusan yang Anda bimbing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((tpl) => (
            <TemplateCard key={tpl.id} template={tpl} onEdit={setEditingTemplate} />
          ))}
        </div>
      )}

      <TemplateEditDialog
        template={editingTemplate}
        isOpen={!!editingTemplate}
        onClose={() => setEditingTemplate(null)}
        onSave={handleSaveTemplate}
      />

      <PeriodCreateDialog
        isOpen={isPeriodModalOpen}
        periods={periods}
        onClose={() => setIsPeriodModalOpen(false)}
        onSubmit={handleCreatePeriod}
      />
    </div>
  )
}
