"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { authStore } from "@/lib/auth/auth-store"
import type {
  UserItem,
  UserFilter,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types/user"
import type { PaginationMeta } from "@/types/auth"

export const USERS_QUERY_KEY = ["users"]

export interface UseUsersQueryParams {
  page?: number
  limit?: number
  filter?: UserFilter
  enabled?: boolean
}

export interface UsersQueryResult {
  users: UserItem[]
  pagination?: PaginationMeta
}

export function useUsersPaginatedQuery({
  page = 1,
  limit = 10,
  filter = {},
  enabled,
}: UseUsersQueryParams = {}) {
  const token = authStore.getToken()
  const isEnabled = enabled !== undefined ? enabled : !!token

  return useQuery({
    queryKey: [...USERS_QUERY_KEY, page, limit, filter],
    queryFn: async (): Promise<UsersQueryResult> => {
      const queryParams = new URLSearchParams()
      queryParams.set("page", String(page))
      queryParams.set("limit", String(limit))

      if (filter.search?.trim()) {
        queryParams.set("search", filter.search.trim())
      }
      if (filter.role_id) {
        queryParams.set("role_id", filter.role_id)
      }
      if (filter.department_id) {
        queryParams.set("department_id", filter.department_id)
      }
      if (filter.company_id) {
        queryParams.set("company_id", filter.company_id)
      }
      if (filter.parent_id) {
        queryParams.set("parent_id", filter.parent_id)
      }
      if (filter.status) {
        queryParams.set("status", filter.status)
      }

      const res = await apiClient.getPaginated<UserItem>(
        `/users?${queryParams.toString()}`
      )

      return {
        users: Array.isArray(res.data) ? res.data : [],
        pagination: res.meta?.pagination,
      }
    },
    enabled: isEnabled,
    staleTime: 60 * 1000,
  })
}

export function useUserDetailQuery(id?: string) {
  const token = authStore.getToken()

  return useQuery({
    queryKey: [...USERS_QUERY_KEY, "detail", id],
    queryFn: async (): Promise<UserItem> => {
      if (!id) throw new Error("ID pengguna diperlukan")
      return apiClient.get<UserItem>(`/users/${id}`)
    },
    enabled: !!token && !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUserPayload): Promise<UserItem> => {
      return apiClient.post<UserItem>("/users", payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      queryClient.invalidateQueries({ queryKey: ["departments"] })
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateUserPayload
    }): Promise<UserItem> => {
      return apiClient.put<UserItem>(`/users/${id}`, payload)
    },
    onSuccess: (updatedUser, variables) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      queryClient.setQueryData(
        [...USERS_QUERY_KEY, "detail", variables.id],
        updatedUser
      )
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      queryClient.invalidateQueries({ queryKey: ["departments"] })
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/users/${id}`)
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      queryClient.removeQueries({ queryKey: [...USERS_QUERY_KEY, "detail", deletedId] })
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      queryClient.invalidateQueries({ queryKey: ["departments"] })
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })
}
