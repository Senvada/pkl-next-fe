"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { authStore } from "@/lib/auth/auth-store"
import type { Role, CreateRolePayload, UpdateRolePayload } from "@/types/role"

export const ROLES_QUERY_KEY = ["roles"]

export function useRolesQuery(options: { enabled?: boolean } = {}) {
  const token = authStore.getToken()
  const isEnabled = options.enabled !== undefined ? options.enabled : !!token

  return useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: async (): Promise<Role[]> => {
      const roles = await apiClient.get<Role[]>("/roles")
      return Array.isArray(roles) ? roles : []
    },
    enabled: isEnabled,
    staleTime: 2 * 60 * 1000,
  })
}

export function useRoleQuery(id?: string) {
  const token = authStore.getToken()

  return useQuery({
    queryKey: [...ROLES_QUERY_KEY, id],
    queryFn: async (): Promise<Role> => {
      if (!id) throw new Error("Role ID diperlukan")
      return apiClient.get<Role>(`/roles/${id}`)
    },
    enabled: !!token && !!id,
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateRolePayload): Promise<Role> => {
      return apiClient.post<Role>("/roles", payload)
    },
    onSuccess: (newRole) => {
      queryClient.setQueryData<Role[]>(ROLES_QUERY_KEY, (old = []) => {
        if (!Array.isArray(old)) return [newRole]
        if (old.some((r) => r.id === newRole.id)) return old
        return [...old, newRole]
      })
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY })
    },
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateRolePayload
    }): Promise<Role> => {
      return apiClient.put<Role>(`/roles/${id}`, payload)
    },
    onSuccess: (updatedRole, variables) => {
      queryClient.setQueryData<Role[]>(ROLES_QUERY_KEY, (old = []) => {
        if (!Array.isArray(old)) return [updatedRole]
        return old.map((r) => (r.id === updatedRole.id ? updatedRole : r))
      })
      queryClient.setQueryData([...ROLES_QUERY_KEY, variables.id], updatedRole)
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...ROLES_QUERY_KEY, variables.id] })
    },
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/roles/${id}`)
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Role[]>(ROLES_QUERY_KEY, (old = []) => {
        if (!Array.isArray(old)) return []
        return old.filter((r) => r.id !== deletedId)
      })
      queryClient.removeQueries({ queryKey: [...ROLES_QUERY_KEY, deletedId] })
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY })
    },
  })
}
