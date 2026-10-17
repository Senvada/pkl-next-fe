"use client"

import * as React from "react"
import {
  Users2,
  Plus,
  Trash2,
  Edit3,
  Search,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Building2,
  GraduationCap,
  ShieldCheck,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Layers,
} from "lucide-react"

import {
  useUsersPaginatedQuery,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/modules/user"
import { useRolesQuery } from "@/hooks/modules/role"
import { useDepartmentsQuery } from "@/hooks/modules/department"
import { useCompaniesQuery } from "@/hooks/modules/company"
import { useProfileQuery } from "@/hooks/modules/profile"
import type { UserItem, CreateUserPayload, UpdateUserPayload } from "@/types/user"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const emptySubscribe = () => () => {}

export default function UserManagementPage() {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  // Current active user profile
  const { data: myProfile } = useProfileQuery()
  const isAdmin = myProfile?.role_name?.toLowerCase() === "admin"
  const isIndustri =
    myProfile?.role_name?.toLowerCase() === "industri" ||
    myProfile?.role_name?.toLowerCase() === "pembimbing industri"

  // Master Data Queries
  const { data: roles = [] } = useRolesQuery()
  const { data: departments = [] } = useDepartmentsQuery()
  const { data: companies = [] } = useCompaniesQuery()

  // Filter & Pagination State
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

  // Filter Payload for API Query
  const filterPayload = React.useMemo(() => ({
    search: debouncedSearch || undefined,
    role_id: filterRole !== "all" ? filterRole : undefined,
    department_id: filterDept !== "all" ? filterDept : undefined,
    company_id: filterCompany !== "all" ? filterCompany : undefined,
    status: filterStatus !== "all" ? filterStatus : undefined,
  }), [debouncedSearch, filterRole, filterDept, filterCompany, filterStatus])

  // Main User Query
  const {
    data: queryResult,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsersPaginatedQuery({
    page,
    limit,
    filter: filterPayload,
  })

  const users = queryResult?.users || []
  const pagination = queryResult?.pagination

  // Mutations
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const isSaving = createUserMutation.isPending || updateUserMutation.isPending
  const isDeleting = deleteUserMutation.isPending
  const isBusy = isSaving || isDeleting

  // Notification Banner
  const [pageNotice, setPageNotice] = React.useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  // Dialog States
  const [formDialogOpen, setFormDialogOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<UserItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState<UserItem | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false)
  const [viewingUser, setViewingUser] = React.useState<UserItem | null>(null)

  // Form Fields State
  const [formName, setFormName] = React.useState("")
  const [formEmail, setFormEmail] = React.useState("")
  const [formPassword, setFormPassword] = React.useState("")
  const [formRoleID, setFormRoleID] = React.useState("")
  const [formDeptID, setFormDeptID] = React.useState("")
  const [formCompanyID, setFormCompanyID] = React.useState("")
  const [formStatus, setFormStatus] = React.useState("active")
  const [formError, setFormError] = React.useState<string | null>(null)

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm("")
    setDebouncedSearch("")
    setFilterRole("all")
    setFilterDept("all")
    setFilterCompany("all")
    setFilterStatus("all")
    setPage(1)
  }

  const hasActiveFilters =
    searchTerm !== "" ||
    filterRole !== "all" ||
    filterDept !== "all" ||
    filterCompany !== "all" ||
    filterStatus !== "all"

  // Open Create Dialog
  const handleOpenCreateDialog = () => {
    setEditingUser(null)
    setFormName("")
    setFormEmail("")
    setFormPassword("")
    // Default role to Siswa if available, else first non-admin role
    const defaultRole =
      roles.find((r) => r.name.toLowerCase() === "siswa") ||
      roles.find((r) => r.name.toLowerCase() !== "admin") ||
      roles[0]
    setFormRoleID(defaultRole?.id || "")
    setFormDeptID("")
    setFormCompanyID(myProfile?.company_id || "")
    setFormStatus("active")
    setFormError(null)
    setFormDialogOpen(true)
  }

  // Open Edit Dialog
  const handleOpenEditDialog = (user: UserItem) => {
    setEditingUser(user)
    setFormName(user.name)
    setFormEmail(user.email)
    setFormPassword("")
    setFormRoleID(user.role_id)
    setFormDeptID(user.department_id || "")
    setFormCompanyID(user.company_id || "")
    setFormStatus(user.status || "active")
    setFormError(null)
    setFormDialogOpen(true)
  }

  // Open Detail Dialog
  const handleOpenDetailDialog = (user: UserItem) => {
    setViewingUser(user)
    setDetailDialogOpen(true)
  }

  // Open Delete Dialog
  const handleOpenDeleteDialog = (user: UserItem) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  // Submit Create or Update
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formName.trim()) {
      setFormError("Nama lengkap wajib diisi")
      return
    }
    if (!formEmail.trim()) {
      setFormError("Alamat email wajib diisi")
      return
    }
    if (!editingUser && !formPassword) {
      setFormError("Kata sandi wajib diisi untuk pengguna baru")
      return
    }
    if (formPassword && formPassword.length < 6) {
      setFormError("Kata sandi minimal 6 karakter")
      return
    }
    if (!formRoleID) {
      setFormError("Role pengguna wajib dipilih")
      return
    }

    try {
      if (editingUser) {
        const payload: UpdateUserPayload = {
          name: formName.trim(),
          email: formEmail.trim(),
          role_id: formRoleID,
          department_id: formDeptID ? formDeptID : null,
          company_id: formCompanyID ? formCompanyID : null,
          status: formStatus,
        }
        if (formPassword) {
          payload.password = formPassword
        }

        await updateUserMutation.mutateAsync({
          id: editingUser.id,
          payload,
        })

        setPageNotice({
          type: "success",
          text: `Data pengguna "${formName}" berhasil diperbarui.`,
        })
      } else {
        const payload: CreateUserPayload = {
          name: formName.trim(),
          email: formEmail.trim(),
          password: formPassword,
          role_id: formRoleID,
          department_id: formDeptID ? formDeptID : null,
          company_id: formCompanyID ? formCompanyID : null,
          status: formStatus,
        }

        await createUserMutation.mutateAsync(payload)

        setPageNotice({
          type: "success",
          text: `Pengguna baru "${formName}" berhasil ditambahkan.`,
        })
      }

      setFormDialogOpen(false)
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan data pengguna."
      setFormError(msg)
    }
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!userToDelete || isDeleting) return

    try {
      await deleteUserMutation.mutateAsync(userToDelete.id)
      setPageNotice({
        type: "success",
        text: `Pengguna "${userToDelete.name}" berhasil dihapus.`,
      })
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Gagal menghapus pengguna."
      setPageNotice({ type: "error", text: msg })
      setDeleteDialogOpen(false)
    }
  }

  // Summary Metrics
  const metrics = React.useMemo(() => {
    const total = pagination?.total_rows ?? users.length
    const siswaCount = users.filter((u) => u.role_name.toLowerCase() === "siswa").length
    const industriCount = users.filter((u) =>
      u.role_name.toLowerCase().includes("industri")
    ).length
    const guruAdminCount = users.filter(
      (u) =>
        u.role_name.toLowerCase() === "admin" ||
        u.role_name.toLowerCase() === "guru"
    ).length

    return { total, siswaCount, industriCount, guruAdminCount }
  }, [users, pagination])

  // Get Avatar Initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full max-w-7xl mx-auto space-y-4">
      {/* 1. HEADER */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <Users2 className="size-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                Manajemen Pengguna
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kelola akun siswa PKL, akun utama industri, pembimbing sekolah, dan penempatan jurusan.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleOpenCreateDialog}
          disabled={isBusy}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-9 px-4 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Tambah Pengguna</span>
        </Button>
      </div>

      {/* Page Notice */}
      {pageNotice && (
        <div
          className={`shrink-0 flex items-center justify-between gap-2 p-3 text-xs rounded-xl border transition-all ${
            pageNotice.type === "success"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {pageNotice.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="size-4 shrink-0 text-destructive" />
            )}
            <span className="truncate">{pageNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setPageNotice(null)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="rounded-2xl border border-border bg-card/60 shadow-xs">
          <CardContent className="p-3.5 sm:p-4 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Users2 className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground truncate">
                Total Akun Terdaftar
              </p>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {mounted ? metrics.total : "-"}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border bg-card/60 shadow-xs">
          <CardContent className="p-3.5 sm:p-4 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <GraduationCap className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground truncate">
                Siswa Peserta PKL
              </p>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {mounted ? metrics.siswaCount : "-"}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border bg-card/60 shadow-xs">
          <CardContent className="p-3.5 sm:p-4 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Building2 className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground truncate">
                Akun Mitra Industri
              </p>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {mounted ? metrics.industriCount : "-"}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border bg-card/60 shadow-xs">
          <CardContent className="p-3.5 sm:p-4 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground truncate">
                Admin &amp; Guru
              </p>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {mounted ? metrics.guruAdminCount : "-"}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. TOOLBAR: SEARCH & FILTERS */}
      <Card className="rounded-2xl border border-border shadow-xs bg-card/60">
        <CardContent className="p-3 sm:p-3.5 space-y-2.5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama pengguna atau email..."
                className="h-8.5 text-xs pl-8.5 rounded-xl bg-background"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Role Filter */}
              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value)
                  setPage(1)
                }}
                className="h-8.5 text-xs rounded-xl border border-input bg-background px-2.5 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                <option value="all">Semua Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              {/* Department (Jurusan) Filter */}
              <select
                value={filterDept}
                onChange={(e) => {
                  setFilterDept(e.target.value)
                  setPage(1)
                }}
                className="h-8.5 text-xs rounded-xl border border-input bg-background px-2.5 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                <option value="all">Semua Jurusan</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>

              {/* Company Filter (Admin Only) */}
              {isAdmin && (
                <select
                  value={filterCompany}
                  onChange={(e) => {
                    setFilterCompany(e.target.value)
                    setPage(1)
                  }}
                  className="h-8.5 text-xs rounded-xl border border-input bg-background px-2.5 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring max-w-[160px] truncate"
                >
                  <option value="all">Semua Industri</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value)
                  setPage(1)
                }}
                className="h-8.5 text-xs rounded-xl border border-input bg-background px-2.5 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="waiting">Menunggu</option>
                <option value="inactive">Nonaktif</option>
                <option value="banned">Diblokir</option>
              </select>

              {/* Reset Filter Button */}
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-8.5 text-xs px-2.5 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer gap-1"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. MAIN USERS TABLE */}
      <Card className="rounded-2xl border border-border shadow-xs bg-card/60 flex flex-col overflow-hidden">
        <CardContent className="p-0">
          {(!mounted || isLoading) && (
            <div className="p-6 space-y-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          )}

          {isError && mounted && (
            <div className="p-8 text-center text-xs text-destructive flex flex-col items-center gap-2">
              <AlertCircle className="size-6" />
              <span>
                {error instanceof Error
                  ? error.message
                  : "Gagal memuat daftar pengguna dari server."}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="h-8 text-xs rounded-xl gap-1.5 cursor-pointer mt-1"
              >
                <RefreshCw className="size-3" />
                <span>Coba Lagi</span>
              </Button>
            </div>
          )}

          {mounted && !isLoading && users.length === 0 && (
            <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
              <Users2 className="size-8 stroke-[1.5] text-muted-foreground/60" />
              <span className="font-semibold text-foreground">
                Tidak ada data pengguna ditemukan
              </span>
              <span>
                {hasActiveFilters
                  ? "Coba ubah kriteria pencarian atau filter yang Anda terapkan."
                  : "Belum ada data pengguna yang terdaftar."}
              </span>
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-8 text-xs rounded-xl cursor-pointer mt-2"
                >
                  Reset Semua Filter
                </Button>
              )}
            </div>
          )}

          {mounted && !isLoading && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground">
                <thead className="bg-muted/40 uppercase tracking-wider text-[10px] font-bold text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Pengguna</th>
                    <th className="px-4 py-3">Peran / Role</th>
                    <th className="px-4 py-3">Jurusan</th>
                    <th className="px-4 py-3">Industri Mitra</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {users.map((user) => {
                    const isSelf = myProfile?.id === user.id
                    const isUserAdmin = user.role_name.toLowerCase() === "admin"

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        {/* 1. Pengguna */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8.5 rounded-full border border-border">
                              <AvatarImage
                                src={user.avatar_url || user.image || ""}
                                alt={user.name}
                              />
                              <AvatarFallback className="text-[11px] font-bold bg-blue-500/10 text-blue-600">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold truncate">
                                  {user.name}
                                </span>
                                {isSelf && (
                                  <Badge
                                    variant="outline"
                                    className="h-4 text-[9px] px-1 rounded-sm border-blue-500/30 text-blue-600"
                                  >
                                    Anda
                                  </Badge>
                                )}
                              </div>
                              <span className="text-[11px] text-muted-foreground truncate block">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Role */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="size-2 rounded-full shrink-0"
                              style={{
                                backgroundColor: user.role?.color || "#3B82F6",
                              }}
                            />
                            <span className="font-medium">{user.role_name}</span>
                          </div>
                        </td>

                        {/* 3. Jurusan / Department */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {user.department ? (
                            <Badge
                              variant="secondary"
                              className="h-5 text-[10px] px-2 rounded-md font-medium"
                              style={{
                                backgroundColor: `${user.department.color || "#10B981"}15`,
                                color: user.department.color || "#10B981",
                                borderColor: `${user.department.color || "#10B981"}30`,
                              }}
                            >
                              {user.department.code} - {user.department.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground/60 text-[11px]">—</span>
                          )}
                        </td>

                        {/* 4. Industri Mitra */}
                        <td className="px-4 py-3">
                          {user.company ? (
                            <div className="flex flex-col min-w-0 max-w-[200px]">
                              <span className="font-medium text-xs truncate">
                                {user.company.name}
                              </span>
                              {user.parent_name && (
                                <span className="text-[10px] text-muted-foreground truncate">
                                  PIC: {user.parent_name}
                                </span>
                              )}
                              {user.sub_user_count > 0 && (
                                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                                  {user.sub_user_count} Siswa Terdaftar
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground/60 text-[11px]">—</span>
                          )}
                        </td>

                        {/* 5. Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge
                            variant="secondary"
                            className={`h-5 text-[10px] px-2 rounded-md capitalize font-medium ${
                              user.status === "active"
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                                : user.status === "waiting"
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                                : user.status === "banned"
                                ? "bg-destructive/10 text-destructive border border-destructive/20"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {user.status === "active"
                              ? "Aktif"
                              : user.status === "waiting"
                              ? "Menunggu"
                              : user.status === "banned"
                              ? "Diblokir"
                              : "Nonaktif"}
                          </Badge>
                        </td>

                        {/* 6. Actions */}
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenDetailDialog(user)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                              title="Lihat Detail"
                            >
                              <Eye className="size-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditDialog(user)}
                              disabled={isBusy}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 transition-colors cursor-pointer"
                              title="Ubah Data"
                            >
                              <Edit3 className="size-3.5" />
                            </button>

                            {!isSelf && !isUserAdmin && (
                              <button
                                type="button"
                                onClick={() => handleOpenDeleteDialog(user)}
                                disabled={isBusy}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                title="Hapus Pengguna"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination && pagination.total_pages > 1 && (
            <div className="p-3 sm:p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                Menampilkan{" "}
                <strong>{(pagination.page - 1) * pagination.limit + 1}</strong> -{" "}
                <strong>
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total_rows
                  )}
                </strong>{" "}
                dari <strong>{pagination.total_rows}</strong> pengguna
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={!pagination.has_prev || isBusy}
                  className="h-8 text-xs rounded-xl px-2.5 cursor-pointer"
                >
                  <ChevronLeft className="size-3.5 mr-1" />
                  <span>Sebelumnya</span>
                </Button>

                <div className="flex items-center px-2 text-xs font-semibold text-foreground">
                  Halaman {pagination.page} dari {pagination.total_pages}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(prev + 1, pagination.total_pages)
                    )
                  }
                  disabled={!pagination.has_next || isBusy}
                  className="h-8 text-xs rounded-xl px-2.5 cursor-pointer"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="size-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. CREATE / EDIT USER MODAL */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <form onSubmit={handleSaveUser}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                {editingUser ? (
                  <>
                    <Edit3 className="size-5 text-blue-600" />
                    <span>Ubah Data Pengguna</span>
                  </>
                ) : (
                  <>
                    <Plus className="size-5 text-blue-600" />
                    <span>Tambah Pengguna Baru</span>
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                {editingUser
                  ? "Perbarui informasi akun, role, jurusan, atau status akun."
                  : "Daftarkan pengguna baru, tetapkan role, jurusan siswa, dan industri mitra."}
              </DialogDescription>
            </DialogHeader>

            {formError && (
              <div className="mt-3 p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-3.5 py-4">
              {/* Nama Lengkap */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Alamat Email <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="nama@smkn6malang.sch.id"
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>

              {/* Kata Sandi */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Kata Sandi{" "}
                    {!editingUser && <span className="text-destructive">*</span>}
                  </label>
                  {editingUser && (
                    <span className="text-[10px] text-muted-foreground">
                      Kosongkan jika tidak diubah
                    </span>
                  )}
                </div>
                <Input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={
                    editingUser ? "••••••••" : "Minimal 6 karakter"
                  }
                  className="h-9 text-xs rounded-xl"
                  required={!editingUser}
                />
              </div>

              {/* Role & Jurusan Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Role */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Role / Hak Akses <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formRoleID}
                    onChange={(e) => setFormRoleID(e.target.value)}
                    className="w-full h-9 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
                    required
                  >
                    <option value="" disabled>
                      Pilih Role
                    </option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Jurusan (Department) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Jurusan Siswa
                  </label>
                  <select
                    value={formDeptID}
                    onChange={(e) => setFormDeptID(e.target.value)}
                    className="w-full h-9 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Tidak Ditentukan / Umum</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Industri Mitra (Company) & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Perusahaan Industri */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Industri / Mitra PKL
                  </label>
                  <select
                    value={formCompanyID}
                    onChange={(e) => setFormCompanyID(e.target.value)}
                    disabled={!isAdmin && isIndustri}
                    className="w-full h-9 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring disabled:opacity-60"
                  >
                    <option value="">Tidak Ditautkan</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {!isAdmin && isIndustri && (
                    <span className="text-[10px] text-muted-foreground block">
                      Terkunci pada industri Anda
                    </span>
                  )}
                </div>

                {/* Status Akun */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Status Akun
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full h-9 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
                  >
                    <option value="active">Aktif</option>
                    <option value="waiting">Menunggu</option>
                    <option value="inactive">Nonaktif</option>
                    <option value="banned">Diblokir</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormDialogOpen(false)}
                disabled={isSaving}
                className="rounded-xl h-9 text-xs cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white h-9 text-xs cursor-pointer font-semibold"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>{editingUser ? "Simpan Perubahan" : "Tambah Pengguna"}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. USER DETAIL MODAL */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Eye className="size-5 text-blue-600" />
              <span>Detail Akun Pengguna</span>
            </DialogTitle>
          </DialogHeader>

          {viewingUser && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-muted/40 border border-border">
                <Avatar className="size-12 rounded-full border border-border">
                  <AvatarImage
                    src={viewingUser.avatar_url || viewingUser.image || ""}
                    alt={viewingUser.name}
                  />
                  <AvatarFallback className="text-sm font-bold bg-blue-500/10 text-blue-600">
                    {getInitials(viewingUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {viewingUser.name}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                    <Mail className="size-3 text-muted-foreground" />
                    <span>{viewingUser.email}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-border bg-card">
                  <span className="text-[11px] text-muted-foreground block mb-1">
                    Role &amp; Hak Akses
                  </span>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <div
                      className="size-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: viewingUser.role?.color || "#3B82F6",
                      }}
                    />
                    <span>{viewingUser.role_name}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-border bg-card">
                  <span className="text-[11px] text-muted-foreground block mb-1">
                    Jurusan / Departemen
                  </span>
                  <span className="font-semibold text-foreground">
                    {viewingUser.department
                      ? `${viewingUser.department.code} - ${viewingUser.department.name}`
                      : "Tidak Ditentukan"}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-border bg-card">
                  <span className="text-[11px] text-muted-foreground block mb-1">
                    Industri Mitra
                  </span>
                  <span className="font-semibold text-foreground">
                    {viewingUser.company?.name || "Tidak Ditautkan"}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-border bg-card">
                  <span className="text-[11px] text-muted-foreground block mb-1">
                    Status Akun
                  </span>
                  <Badge
                    variant="secondary"
                    className="h-5 text-[10px] px-2 rounded-md capitalize font-medium"
                  >
                    {viewingUser.status}
                  </Badge>
                </div>
              </div>

              {viewingUser.parent_name && (
                <div className="p-3 rounded-xl border border-border bg-muted/20 text-xs">
                  <span className="text-[11px] text-muted-foreground block">
                    Pembimbing Industri (PIC)
                  </span>
                  <span className="font-semibold text-foreground">
                    {viewingUser.parent_name}
                  </span>
                </div>
              )}

              {viewingUser.sub_user_count > 0 && (
                <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/10 text-xs text-purple-700 dark:text-purple-300">
                  Akun Industri ini mengelola{" "}
                  <strong>{viewingUser.sub_user_count} siswa PKL</strong>.
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDetailDialogOpen(false)}
              className="rounded-xl h-9 text-xs cursor-pointer w-full"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. DELETE CONFIRMATION MODAL */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="size-5 shrink-0" />
              <span>Hapus Pengguna &quot;{userToDelete?.name}&quot;?</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun pengguna ini? Akun yang dihapus akan dinonaktifkan dari sistem.
            </DialogDescription>
          </DialogHeader>

          {userToDelete && userToDelete.sub_user_count > 0 && (
            <div className="p-3 text-xs rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200">
              Perhatian: Pengguna ini adalah akun pembimbing yang memiliki{" "}
              <strong>{userToDelete.sub_user_count} sub-akun siswa</strong> di bawahnya.
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="rounded-xl h-9 text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="rounded-xl h-9 text-xs cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  <span>Menghapus...</span>
                </>
              ) : (
                "Ya, Hapus Pengguna"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
