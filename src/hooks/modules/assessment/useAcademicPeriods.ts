"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import type { AcademicPeriod } from "@/types/assessment"

export const ACADEMIC_PERIODS_KEY = ["academic-periods"]

export function useAcademicPeriodsQuery() {
  return useQuery({
    queryKey: ACADEMIC_PERIODS_KEY,
    queryFn: async (): Promise<AcademicPeriod[]> => {
      const res = await apiClient.get<AcademicPeriod[]>("/academic-periods")
      return Array.isArray(res) ? res : []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateAcademicPeriod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { name: string; is_active?: boolean; copy_from_id?: string }) => {
      return apiClient.post<AcademicPeriod>("/academic-periods", payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_PERIODS_KEY })
    },
  })
}

export function useSetActiveAcademicPeriod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.put<AcademicPeriod>(`/academic-periods/${id}/activate`, {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_PERIODS_KEY })
    },
  })
}
