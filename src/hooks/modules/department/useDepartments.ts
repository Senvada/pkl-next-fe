"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { authStore } from "@/lib/auth/auth-store"
import type {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "@/types/department"

export const DEPARTMENTS_QUERY_KEY = ["departments"]

export function useDepartmentsQuery(options: { enabled?: boolean } = {}) {
  const token = authStore.getToken()
  const isEnabled = options.enabled !== undefined ? options.enabled : !!token

  return useQuery({
    queryKey: DEPARTMENTS_QUERY_KEY,
    queryFn: async (): Promise<Department[]> => {
      const depts = await apiClient.get<Department[]>("/departments")
      return Array.isArray(depts) ? depts : []
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateDepartmentPayload): Promise<Department> => {
      return apiClient.post<Department>("/departments", payload)
    },
    onSuccess: (newDept) => {
      queryClient.setQueryData<Department[]>(DEPARTMENTS_QUERY_KEY, (old = []) => {
        if (!Array.isArray(old)) return [newDept]
        if (old.some((d) => d.id === newDept.id)) return old
        return [...old, newDept]
      })
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY })
    },
  })
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateDepartmentPayload
    }): Promise<Department> => {
      return apiClient.put<Department>(`/departments/${id}`, payload)
    },
    onSuccess: (updatedDept) => {
      queryClient.setQueryData<Department[]>(DEPARTMENTS_QUERY_KEY, (old = []) => {
        if (!Array.isArray(old)) return [updatedDept]
        return old.map((d) => (d.id === updatedDept.id ? updatedDept : d))
      })
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY })
    },
  })
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/departments/${id}`)
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Department[]>(DEPARTMENTS_QUERY_KEY, (old = []) => {
        if (!Array.isArray(old)) return []
        return old.filter((d) => d.id !== deletedId)
      })
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY })
    },
  })
}
