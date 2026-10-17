"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { authStore } from "@/lib/auth/auth-store"
import type { Company } from "@/types/company"

export const COMPANIES_QUERY_KEY = ["companies"]

export function useCompaniesQuery(options: { enabled?: boolean } = {}) {
  const token = authStore.getToken()
  const isEnabled = options.enabled !== undefined ? options.enabled : !!token

  return useQuery({
    queryKey: COMPANIES_QUERY_KEY,
    queryFn: async (): Promise<Company[]> => {
      const companies = await apiClient.get<Company[]>("/companies")
      return Array.isArray(companies) ? companies : []
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  })
}
