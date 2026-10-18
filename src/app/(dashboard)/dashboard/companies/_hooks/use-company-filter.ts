"use client"

import * as React from "react"
import type { CompanyFilter } from "@/types/company"

export function useCompanyFilter() {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [departmentId, setDepartmentId] = React.useState("")
  const [status, setStatus] = React.useState("")

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(handler)
  }, [search])

  const handleDepartmentChange = React.useCallback((val: string) => {
    setDepartmentId(val)
    setPage(1)
  }, [])

  const handleStatusChange = React.useCallback((val: string) => {
    setStatus(val)
    setPage(1)
  }, [])

  const handleReset = React.useCallback(() => {
    setSearch("")
    setDebouncedSearch("")
    setDepartmentId("")
    setStatus("")
    setPage(1)
  }, [])

  const filterPayload: CompanyFilter = React.useMemo(() => {
    const f: CompanyFilter = {}
    if (debouncedSearch.trim()) f.search = debouncedSearch.trim()
    if (departmentId) f.department_id = departmentId
    if (status) f.status = status
    return f
  }, [debouncedSearch, departmentId, status])

  const isFiltered = Boolean(debouncedSearch || departmentId || status)

  return {
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    departmentId,
    setDepartmentId: handleDepartmentChange,
    status,
    setStatus: handleStatusChange,
    filterPayload,
    isFiltered,
    resetFilter: handleReset,
  }
}
