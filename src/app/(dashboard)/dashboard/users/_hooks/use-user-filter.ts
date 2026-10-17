import * as React from "react"

export function useUserFilter() {
  const [page, setPage] = React.useState(1)
  const [limit] = React.useState(10)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [filterRole, setFilterRole] = React.useState<string>("all")
  const [filterDept, setFilterDept] = React.useState<string>("all")
  const [filterCompany, setFilterCompany] = React.useState<string>("all")
  const [filterStatus, setFilterStatus] = React.useState<string>("all")

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset all filters
  const handleResetFilters = React.useCallback(() => {
    setSearchTerm("")
    setDebouncedSearch("")
    setFilterRole("all")
    setFilterDept("all")
    setFilterCompany("all")
    setFilterStatus("all")
    setPage(1)
  }, [])

  const hasActiveFilters =
    searchTerm !== "" ||
    filterRole !== "all" ||
    filterDept !== "all" ||
    filterCompany !== "all" ||
    filterStatus !== "all"

  // Filter Payload for TanStack Query
  const filterPayload = React.useMemo(
    () => ({
      search: debouncedSearch || undefined,
      role_id: filterRole !== "all" ? filterRole : undefined,
      department_id: filterDept !== "all" ? filterDept : undefined,
      company_id: filterCompany !== "all" ? filterCompany : undefined,
      status: filterStatus !== "all" ? filterStatus : undefined,
    }),
    [debouncedSearch, filterRole, filterDept, filterCompany, filterStatus]
  )

  return {
    page,
    setPage,
    limit,
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    filterDept,
    setFilterDept,
    filterCompany,
    setFilterCompany,
    filterStatus,
    setFilterStatus,
    handleResetFilters,
    hasActiveFilters,
    filterPayload,
  }
}
