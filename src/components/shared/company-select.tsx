"use client"

import * as React from "react"
import { Building2 } from "lucide-react"
import { InfiniteSelect } from "./infinite-select"
import { apiClient } from "@/lib/api/client"
import type { Company } from "@/types/company"

interface CompanySelectProps {
  value?: string | null
  onChange: (companyId: string | null, company?: Company | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  selectedLabel?: string
  allowClear?: boolean
}

export function CompanySelect({
  value,
  onChange,
  placeholder = "Pilih mitra industri...",
  disabled = false,
  className,
  selectedLabel,
  allowClear = true,
}: CompanySelectProps) {
  const fetchCompanies = React.useCallback(async (page: number, limit: number, search: string) => {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", String(limit))
    if (search.trim()) params.set("search", search.trim())

    const res = await apiClient.getPaginated<Company>(`/companies?${params.toString()}`)
    return {
      items: Array.isArray(res.data) ? res.data : [],
      pagination: res.meta?.pagination,
    }
  }, [])

  return (
    <InfiniteSelect<Company>
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Ketik nama industri..."
      queryKey={["companies", "infinite-select"]}
      queryFn={fetchCompanies}
      getItemValue={(c) => c.id}
      getItemLabel={(c) => c.name}
      selectedLabel={selectedLabel}
      disabled={disabled}
      allowClear={allowClear}
      className={className}
      renderItem={(company) => (
        <div className="flex items-center gap-2 truncate">
          <Building2 className="size-3.5 text-blue-600 shrink-0" />
          <div className="truncate text-left">
            <span className="font-medium text-slate-800 dark:text-slate-100">{company.name}</span>
            {company.address && (
              <span className="text-[10px] text-muted-foreground block truncate">
                {company.address}
              </span>
            )}
          </div>
        </div>
      )}
    />
  )
}
