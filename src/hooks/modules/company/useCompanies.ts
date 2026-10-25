"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { authStore } from "@/lib/auth/auth-store"
import { useInfiniteScrollQuery } from "@/hooks/shared/use-infinite-scroll-query"
import type {
  Company,
  CompanyIntern,
  CompanyFilter,
  CompanyMapItem,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  PresignCompanyImagePayload,
  PresignCompanyImageResponse,
  ResolveMapsPayload,
  ResolveMapsResponse,
} from "@/types/company"
import type { PaginationMeta } from "@/types/auth"

export const COMPANIES_QUERY_KEY = ["companies"]

export interface UseCompaniesQueryParams {
  page?: number
  limit?: number
  filter?: CompanyFilter
  enabled?: boolean
}

export interface CompaniesQueryResult {
  companies: Company[]
  pagination?: PaginationMeta
}

/**
 * Hook for paginated company listings in dashboard or public catalog
 */
export function useCompaniesPaginatedQuery({
  page = 1,
  limit = 10,
  filter = {},
  enabled,
}: UseCompaniesQueryParams = {}) {
  const token = authStore.getToken()
  const isEnabled = enabled !== undefined ? enabled : !!token

  return useQuery({
    queryKey: [...COMPANIES_QUERY_KEY, "paginated", page, limit, filter],
    queryFn: async (): Promise<CompaniesQueryResult> => {
      const queryParams = new URLSearchParams()
      queryParams.set("page", String(page))
      queryParams.set("limit", String(limit))

      if (filter.search?.trim()) {
        queryParams.set("search", filter.search.trim())
      }
      if (filter.department_id) {
        queryParams.set("department_id", filter.department_id)
      }
      if (filter.status) {
        queryParams.set("status", filter.status)
      }

      const res = await apiClient.getPaginated<Company>(
        `/companies?${queryParams.toString()}`
      )

      return {
        companies: Array.isArray(res.data) ? res.data : [],
        pagination: res.meta?.pagination,
      }
    },
    enabled: isEnabled,
    staleTime: 60 * 1000,
  })
}

/**
 * Hook for infinite scroll company listings (dashboard and catalog)
 */
export function useCompaniesInfiniteQuery({
  limit = 12,
  filter = {},
  enabled,
  rootRef,
}: {
  limit?: number
  filter?: CompanyFilter
  enabled?: boolean
  rootRef?: React.RefObject<Element | null>
} = {}) {
  const token = authStore.getToken()
  const isEnabled = enabled !== undefined ? enabled : !!token

  return useInfiniteScrollQuery<Company>({
    queryKey: [...COMPANIES_QUERY_KEY, "infinite", limit, filter],
    queryFn: async (page, pageLimit) => {
      const queryParams = new URLSearchParams()
      queryParams.set("page", String(page))
      queryParams.set("limit", String(pageLimit))

      if (filter.search?.trim()) {
        queryParams.set("search", filter.search.trim())
      }
      if (filter.department_id) {
        queryParams.set("department_id", filter.department_id)
      }
      if (filter.status) {
        queryParams.set("status", filter.status)
      }

      const res = await apiClient.getPaginated<Company>(
        `/companies?${queryParams.toString()}`
      )

      return {
        items: Array.isArray(res.data) ? res.data : [],
        pagination: res.meta?.pagination,
      }
    },
    limit,
    enabled: isEnabled,
    rootRef,
  })
}

/**
 * Hook for dropdown selections / simplified lists
 */
export function useCompaniesQuery(options: { enabled?: boolean } = {}) {
  const token = authStore.getToken()
  const isEnabled = options.enabled !== undefined ? options.enabled : !!token

  return useQuery({
    queryKey: [...COMPANIES_QUERY_KEY, "all"],
    queryFn: async (): Promise<Company[]> => {
      const res = await apiClient.getPaginated<Company>("/companies?limit=100")
      return Array.isArray(res.data) ? res.data : []
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Detail company by ID (admin/PIC dashboard)
 */
export function useCompanyDetailQuery(id?: string) {
  const token = authStore.getToken()

  return useQuery({
    queryKey: [...COMPANIES_QUERY_KEY, "detail", id],
    queryFn: async (): Promise<Company> => {
      if (!id) throw new Error("ID perusahaan diperlukan")
      return apiClient.get<Company>(`/companies/${id}`)
    },
    enabled: !!token && !!id,
  })
}

/**
 * Detail company by public slug
 */
export function useCompanyBySlugQuery(slug?: string) {
  return useQuery({
    queryKey: [...COMPANIES_QUERY_KEY, "slug", slug],
    queryFn: async (): Promise<Company> => {
      if (!slug) throw new Error("Slug perusahaan diperlukan")
      return apiClient.get<Company>(`/companies/slug/${slug}`, { auth: false })
    },
    enabled: !!slug,
  })
}

/**
 * Map coordinates for all active companies
 */
export function useCompanyMapsQuery() {
  return useQuery({
    queryKey: [...COMPANIES_QUERY_KEY, "maps"],
    queryFn: async (): Promise<CompanyMapItem[]> => {
      const res = await apiClient.get<CompanyMapItem[]>("/companies/maps", { auth: false })
      return Array.isArray(res) ? res : []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateCompanyPayload): Promise<Company> => {
      return apiClient.post<Company>("/companies", payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY })
    },
  })
}

export function useUpdateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateCompanyPayload
    }): Promise<Company> => {
      return apiClient.put<Company>(`/companies/${id}`, payload)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...COMPANIES_QUERY_KEY, "detail", variables.id],
      })
    },
  })
}

export function useUpdateCompanyContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      content,
    }: {
      id: string
      content: unknown
    }): Promise<Company> => {
      return apiClient.patch<Company>(`/companies/${id}/content`, { content })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...COMPANIES_QUERY_KEY, "detail", variables.id],
      })
    },
  })
}

export function useDeleteCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete<void>(`/companies/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY })
    },
  })
}

export function usePresignCompanyImage() {
  return useMutation({
    mutationFn: async (
      payload: PresignCompanyImagePayload
    ): Promise<PresignCompanyImageResponse> => {
      const { company_id, ...body } = payload
      const endpoint = company_id
        ? `/companies/${company_id}/image/presign`
        : "/companies/image/presign"
      return apiClient.post<PresignCompanyImageResponse>(endpoint, body)
    },
  })
}

export function useResolveGoogleMaps() {
  return useMutation({
    mutationFn: async (
      payload: ResolveMapsPayload
    ): Promise<ResolveMapsResponse> => {
      return apiClient.post<ResolveMapsResponse>("/companies/maps/resolve", payload)
    },
  })
}

export function useCompanyInternsQuery(slugOrId?: string, isId = false) {
  return useQuery({
    queryKey: [...COMPANIES_QUERY_KEY, "interns", slugOrId],
    queryFn: async (): Promise<CompanyIntern[]> => {
      if (!slugOrId) return []
      const endpoint = isId
        ? `/companies/${slugOrId}/interns`
        : `/companies/slug/${slugOrId}/interns`
      const res = await apiClient.get<CompanyIntern[]>(endpoint, { auth: false })
      return Array.isArray(res) ? res : []
    },
    enabled: !!slugOrId,
    staleTime: 60 * 1000,
  })
}

