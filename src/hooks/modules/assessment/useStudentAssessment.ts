"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import type {
  StudentAssessment,
  UpsertStudentAssessmentPayload,
} from "@/types/assessment"

export const STUDENT_ASSESSMENTS_KEY = ["student-assessments"]

export function useMyStudentAssessmentQuery(periodId?: string) {
  return useQuery({
    queryKey: [...STUDENT_ASSESSMENTS_KEY, "my", periodId],
    queryFn: async (): Promise<StudentAssessment> => {
      const url = periodId
        ? `/student-assessments/my?period_id=${periodId}`
        : "/student-assessments/my"
      return apiClient.get<StudentAssessment>(url)
    },
  })
}

export function useUpsertStudentAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpsertStudentAssessmentPayload) => {
      return apiClient.post<StudentAssessment>("/student-assessments", payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_ASSESSMENTS_KEY })
    },
  })
}

export function useStudentAssessmentDetailQuery(id: string) {
  return useQuery({
    queryKey: [...STUDENT_ASSESSMENTS_KEY, "detail", id],
    queryFn: async (): Promise<StudentAssessment> => {
      return apiClient.get<StudentAssessment>(`/student-assessments/${id}`)
    },
    enabled: !!id,
  })
}

export function useStudentAssessmentsListQuery(
  periodId?: string,
  deptId?: string,
  search?: string
) {
  return useQuery({
    queryKey: [...STUDENT_ASSESSMENTS_KEY, "list", periodId, deptId, search],
    queryFn: async (): Promise<StudentAssessment[]> => {
      const params = new URLSearchParams()
      if (periodId) params.append("period_id", periodId)
      if (deptId) params.append("department_id", deptId)
      if (search) params.append("search", search)
      const res = await apiClient.get<StudentAssessment[]>(
        `/student-assessments?${params.toString()}`
      )
      return Array.isArray(res) ? res : []
    },
  })
}
