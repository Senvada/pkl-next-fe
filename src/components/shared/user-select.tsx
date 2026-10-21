"use client"

import * as React from "react"
import { User, ShieldCheck } from "lucide-react"
import { InfiniteSelect } from "./infinite-select"
import { apiClient } from "@/lib/api/client"
import type { UserItem } from "@/types/user"

interface UserSelectProps {
  value?: string | null
  onChange: (userId: string | null, user?: UserItem | null) => void
  placeholder?: string
  roleId?: string
  departmentId?: string
  companyId?: string
  disabled?: boolean
  className?: string
  selectedLabel?: string
  allowClear?: boolean
}

export function UserSelect({
  value,
  onChange,
  placeholder = "Pilih pengguna...",
  roleId,
  departmentId,
  companyId,
  disabled = false,
  className,
  selectedLabel,
  allowClear = true,
}: UserSelectProps) {
  const fetchUsers = React.useCallback(async (page: number, limit: number, search: string) => {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", String(limit))
    if (search.trim()) params.set("search", search.trim())
    if (roleId) params.set("role_id", roleId)
    if (departmentId) params.set("department_id", departmentId)
    if (companyId) params.set("company_id", companyId)

    const res = await apiClient.getPaginated<UserItem>(`/users?${params.toString()}`)
    return {
      items: Array.isArray(res.data) ? res.data : [],
      pagination: res.meta?.pagination,
    }
  }, [roleId, departmentId, companyId])

  return (
    <InfiniteSelect<UserItem>
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Cari nama atau email..."
      queryKey={["users", "infinite-select", roleId ?? "", departmentId ?? "", companyId ?? ""]}
      queryFn={fetchUsers}
      getItemValue={(u) => u.id}
      getItemLabel={(u) => u.name}
      selectedLabel={selectedLabel}
      disabled={disabled}
      allowClear={allowClear}
      className={className}
      renderItem={(user) => (
        <div className="flex items-center gap-2 truncate">
          <User className="size-3.5 text-slate-500 shrink-0" />
          <div className="truncate text-left">
            <span className="font-medium text-slate-800 dark:text-slate-100">{user.name}</span>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground truncate">
              <span>{user.email}</span>
              {user.role_name && (
                <>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-0.5 text-blue-600 font-medium">
                    <ShieldCheck className="size-2.5" />
                    {user.role_name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    />
  )
}
