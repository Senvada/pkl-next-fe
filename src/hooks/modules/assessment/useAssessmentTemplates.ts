"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import type {
  AssessmentTemplate,
  AspectTemplateItem,
} from "@/types/assessment"

export const ASSESSMENT_TEMPLATES_KEY = ["assessment-templates"]

export function useAssessmentTemplatesQuery(periodId?: string, deptId?: string) {
  return useQuery({
    queryKey: [...ASSESSMENT_TEMPLATES_KEY, periodId, deptId],
    queryFn: async (): Promise<AssessmentTemplate[]> => {
      const params = new URLSearchParams()
      if (periodId) params.append("period_id", periodId)
      if (deptId) params.append("department_id", deptId)
      const res = await apiClient.get<AssessmentTemplate[]>(
        `/assessment-templates?${params.toString()}`
      )
      return Array.isArray(res) ? res : []
    },
  })
}

export function useAssessmentTemplateDetailQuery(id: string) {
  return useQuery({
    queryKey: [...ASSESSMENT_TEMPLATES_KEY, "detail", id],
    queryFn: async (): Promise<AssessmentTemplate> => {
      return apiClient.get<AssessmentTemplate>(`/assessment-templates/${id}`)
    },
    enabled: !!id,
  })
}

export function useUpdateAssessmentTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: {
        title: string
        work_aspects: AspectTemplateItem[]
        behavior_aspects: AspectTemplateItem[]
      }
    }) => {
      return apiClient.put<AssessmentTemplate>(`/assessment-templates/${id}`, payload)
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENT_TEMPLATES_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ASSESSMENT_TEMPLATES_KEY, "detail", vars.id],
      })
    },
  })
}
