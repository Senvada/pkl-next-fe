"use client"

import * as React from "react"
import {
  ShieldCheck,
  Plus,
  Trash2,
  Search,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Users,
  Newspaper,
  Building2,
  FolderTree,
  Layers,
  Sparkles,
  Lock,
  ChevronRight,
  ArrowLeft,
  CheckCheck,
  XCircle,
} from "lucide-react"

import {
  useRolesQuery,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/hooks/modules/role"
import {
  MODULES_CONFIG,
  createEmptyPermissions,
  createFullPermissions,
  type Role,
  type RolesPermission,
} from "@/types/role"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ColorPickerPopover } from "@/components/shared/color-picker-popover"

const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  article: Newspaper,
  company: Building2,
  role: ShieldCheck,
  department: FolderTree,
  asset: Layers,
}

const emptySubscribe = () => () => {}

export default function RolesManagementPage() {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const { data: roles = [], isLoading, isError, error } = useRolesQuery()

  const createRoleMutation = useCreateRole()
  const updateRoleMutation = useUpdateRole()
  const deleteRoleMutation = useDeleteRole()

  // Selected Role & Form state
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(null)
  const [isCreatingNew, setIsCreatingNew] = React.useState(false)

  const [roleName, setRoleName] = React.useState("")
  const [color, setColor] = React.useState("#3B82F6")
  const [permissions, setPermissions] = React.useState<RolesPermission>(createEmptyPermissions())

  // Search & Filter state
  const [roleSearch, setRoleSearch] = React.useState("")
  const [permSearch, setPermSearch] = React.useState("")

  // Notice banner state
  const [notice, setNotice] = React.useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  // Delete modal state
  const [roleToDelete, setRoleToDelete] = React.useState<Role | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)

  // Mobile view toggle (shows editor on mobile if a role is selected)
  const [mobileEditorOpen, setMobileEditorOpen] = React.useState(false)

  // Active role reference
  const selectedRole = React.useMemo(() => {
    if (isCreatingNew) return null
    return roles.find((r) => r.id === selectedRoleId) || null
  }, [roles, selectedRoleId, isCreatingNew])

  // Select initial role when list loads
  React.useEffect(() => {
    if (!selectedRoleId && !isCreatingNew && roles.length > 0) {
      const firstRole = roles[0]
      setSelectedRoleId(firstRole.id || null)
      setRoleName(firstRole.name)
      setColor(firstRole.color || "#3B82F6")
      setPermissions(firstRole.permissions || createEmptyPermissions())
    }
  }, [roles, selectedRoleId, isCreatingNew])

  // Synchronize state when selected role changes
  const handleSelectRole = (role: Role) => {
    setSelectedRoleId(role.id || null)
    setIsCreatingNew(false)
    setRoleName(role.name)
    setColor(role.color || "#3B82F6")
    setPermissions(role.permissions || createEmptyPermissions())
    setNotice(null)
    setPermSearch("")
    setMobileEditorOpen(true)
  }

  // Handle click on "Tambah Role Baru"
  const handleStartCreateRole = () => {
    setSelectedRoleId(null)
    setIsCreatingNew(true)
    setRoleName("")
    setColor("#3B82F6")
    setPermissions(createEmptyPermissions())
    setNotice(null)
    setPermSearch("")
    setMobileEditorOpen(true)
  }

  // Detect dirty / unsaved changes
  const isDirty = React.useMemo(() => {
    if (isCreatingNew) {
      return roleName.trim().length > 0 || color !== "#3B82F6"
    }
    if (!selectedRole) return false
    return (
      roleName !== selectedRole.name ||
      color !== selectedRole.color ||
      JSON.stringify(permissions) !== JSON.stringify(selectedRole.permissions)
    )
  }, [isCreatingNew, selectedRole, roleName, color, permissions])

  // Reset to current selected role values
  const handleReset = () => {
    if (isCreatingNew) {
      setRoleName("")
      setColor("#3B82F6")
      setPermissions(createEmptyPermissions())
    } else if (selectedRole) {
      setRoleName(selectedRole.name)
      setColor(selectedRole.color || "#3B82F6")
      setPermissions(selectedRole.permissions || createEmptyPermissions())
    }
    setNotice(null)
  }

  // Toggle individual permission with dependency logic
  const togglePermission = (module: string, action: string, actions: string[]) => {
    setPermissions((prev) => {
      const currentMod = prev[module] || {}
      const curValue = !!currentMod[action]
      const newValue = !curValue

      // 1. If unchecking 'read', uncheck all actions in this module
      if (action === "read" && !newValue) {
        return {
          ...prev,
          [module]: Object.fromEntries(actions.map((a) => [a, false])),
        }
      }

      // 2. If checking any action besides 'read', ensure 'read' is also checked
      if (action !== "read" && newValue && !currentMod.read) {
        return {
          ...prev,
          [module]: {
            ...currentMod,
            [action]: true,
            read: true,
          },
        }
      }

      // 3. Normal toggle
      return {
        ...prev,
        [module]: {
          ...currentMod,
          [action]: newValue,
        },
      }
    })
  }

  // Toggle all actions in a single module
  const toggleAllModule = (module: string, actions: string[]) => {
    setPermissions((prev) => {
      const currentMod = prev[module] || {}
      const allActive = actions.every((a) => !!currentMod[a])
      const targetState = !allActive

      return {
        ...prev,
        [module]: Object.fromEntries(actions.map((a) => [a, targetState])),
      }
    })
  }

  // Grant all permissions across all modules
  const handleEnableAllPermissions = () => {
    setPermissions(createFullPermissions())
  }

  // Disable all permissions across all modules
  const handleDisableAllPermissions = () => {
    setPermissions(createEmptyPermissions())
  }

  // Save role changes (create or update)
  const handleSaveRole = async () => {
    setNotice(null)
    const trimmedName = roleName.trim()
    if (!trimmedName) {
      setNotice({ type: "error", text: "Nama role wajib diisi." })
      return
    }

    try {
      if (isCreatingNew) {
        const created = await createRoleMutation.mutateAsync({
          name: trimmedName,
          color,
          permissions,
        })
        setNotice({ type: "success", text: `Role "${created.name}" berhasil dibuat!` })
        setIsCreatingNew(false)
        if (created.id) {
          setSelectedRoleId(created.id)
        }
      } else if (selectedRole && selectedRole.id) {
        const updated = await updateRoleMutation.mutateAsync({
          id: selectedRole.id,
          payload: {
            name: trimmedName,
            color,
            permissions,
          },
        })
        setNotice({ type: "success", text: `Role "${updated.name}" berhasil diperbarui!` })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan role."
      setNotice({ type: "error", text: msg })
    }
  }

  // Prompt delete dialog
  const promptDeleteRole = (e: React.MouseEvent, role: Role) => {
    e.stopPropagation()
    setRoleToDelete(role)
    setDeleteModalOpen(true)
  }

  // Confirm delete execution
  const handleConfirmDelete = async () => {
    if (!roleToDelete || !roleToDelete.id) return

    try {
      await deleteRoleMutation.mutateAsync(roleToDelete.id)
      setDeleteModalOpen(false)
      if (selectedRoleId === roleToDelete.id) {
        setSelectedRoleId(null)
        setIsCreatingNew(false)
      }
      setNotice({
        type: "success",
        text: `Role "${roleToDelete.name}" berhasil dihapus.`,
      })
      setRoleToDelete(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus role."
      setNotice({ type: "error", text: msg })
      setDeleteModalOpen(false)
    }
  }

  // Filter roles list
  const filteredRoles = React.useMemo(() => {
    if (!roleSearch.trim()) return roles
    const q = roleSearch.toLowerCase()
    return roles.filter((r) => r.name.toLowerCase().includes(q))
  }, [roles, roleSearch])

  // Filter modules and actions based on search
  const filteredModules = React.useMemo(() => {
    const entries = Object.entries(MODULES_CONFIG)
    if (!permSearch.trim()) return entries

    const q = permSearch.toLowerCase()
    return entries.filter(([key, config]) => {
      const modMatch =
        key.toLowerCase().includes(q) ||
        config.title.toLowerCase().includes(q) ||
        config.description.toLowerCase().includes(q)

      const actionMatch = Object.entries(config.actions).some(
        ([actKey, actConfig]) =>
          actKey.toLowerCase().includes(q) ||
          actConfig.label.toLowerCase().includes(q) ||
          actConfig.description.toLowerCase().includes(q)
      )

      return modMatch || actionMatch
    })
  }, [permSearch])

  const isSystemAdminRole = selectedRole?.name.toLowerCase() === "admin"
  const isSaving = createRoleMutation.isPending || updateRoleMutation.isPending

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="size-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Hak Akses &amp; Role
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kelola tingkatan role dan matriks izin aksi modul sistem secara terpusat dan fleksibel.
          </p>
        </div>

        <Button
          onClick={handleStartCreateRole}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-9 px-3.5 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Tambah Role Baru</span>
        </Button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Role List */}
        <div
          className={`lg:col-span-4 xl:col-span-4 space-y-3 ${
            mobileEditorOpen ? "hidden lg:block" : "block"
          }`}
        >
          <Card className="rounded-2xl border border-border shadow-xs bg-card/60 backdrop-blur-xs overflow-hidden">
            <CardHeader className="p-3.5 pb-2.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Daftar Role{mounted && roles.length > 0 ? ` (${roles.length})` : ""}
                </CardTitle>
              </div>

              {/* Search Role Input */}
              <div className="relative">
                <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  placeholder="Cari nama role..."
                  className="h-8.5 text-xs pl-8.5 rounded-xl"
                />
              </div>
            </CardHeader>

            <CardContent className="p-2 pt-0 max-h-[calc(100vh-22rem)] min-h-[18rem] overflow-y-auto space-y-1">
              {(!mounted || isLoading) && (
                <div className="space-y-2 p-2">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              )}

              {isError && mounted && (
                <div className="p-4 text-center text-xs text-destructive flex flex-col items-center gap-1.5">
                  <AlertCircle className="size-5" />
                  <span>
                    {error instanceof Error
                      ? error.message
                      : "Gagal memuat daftar role dari server."}
                  </span>
                </div>
              )}

              {mounted && !isLoading && filteredRoles.length === 0 && (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  Tidak ada role yang sesuai.
                </div>
              )}

              {mounted &&
                !isLoading &&
                filteredRoles.map((role) => {
                  const isSelected = !isCreatingNew && role.id === selectedRoleId
                  const isAdmin = role.name.toLowerCase() === "admin"

                  return (
                    <div
                      key={role.id}
                      onClick={() => handleSelectRole(role)}
                      className={`group relative flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600/10 border-blue-500/40 text-foreground shadow-xs dark:bg-blue-500/15"
                          : "border-transparent hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {/* Role Color Dot */}
                        <div
                          className="size-3 shrink-0 rounded-full shadow-xs ring-2 ring-background"
                          style={{ backgroundColor: role.color || "#3B82F6" }}
                        />

                        <div className="min-w-0 flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold truncate leading-tight">
                              {role.name}
                            </span>
                            {isAdmin && (
                              <Badge
                                variant="secondary"
                                className="h-4 text-[9px] px-1.5 rounded-md font-mono uppercase bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                              >
                                Sistem
                              </Badge>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {role.user_count !== undefined
                              ? `${role.user_count} pengguna`
                              : "0 pengguna"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {!isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => promptDeleteRole(e, role)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                            title="Hapus role"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                        <ChevronRight
                          className={`size-4 text-muted-foreground transition-transform ${
                            isSelected ? "translate-x-0.5 text-blue-600" : "opacity-40"
                          }`}
                        />
                      </div>
                    </div>
                  )
                })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Role Editor & Permissions Matrix */}
        <div
          className={`lg:col-span-8 xl:col-span-8 space-y-4 ${
            !mobileEditorOpen ? "hidden lg:block" : "block"
          }`}
        >
          {/* Mobile Back Button */}
          <div className="lg:hidden flex items-center mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileEditorOpen(false)}
              className="rounded-xl h-8 px-2.5 text-xs gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Kembali ke Daftar Role</span>
            </Button>
          </div>

          {!selectedRole && !isCreatingNew ? (
            <Card className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/40 flex flex-col items-center justify-center min-h-[28rem]">
              <div className="size-16 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <ShieldCheck className="size-8 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Pilih atau Buat Role Baru
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-5">
                Pilih salah satu role dari panel sebelah kiri untuk menyesuaikan izin akses, atau klik tombol di bawah untuk menambahkan role baru.
              </p>
              <Button
                onClick={handleStartCreateRole}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-9 px-4"
              >
                <Plus className="size-4" />
                <span>Buat Role Baru</span>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Notice Feedback Banner */}
              {notice && (
                <div
                  className={`flex items-center gap-2 p-3 text-xs rounded-xl border ${
                    notice.type === "success"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}
                >
                  {notice.type === "success" ? (
                    <CheckCircle2 className="size-4 shrink-0" />
                  ) : (
                    <AlertCircle className="size-4 shrink-0" />
                  )}
                  <span>{notice.text}</span>
                </div>
              )}

              {/* Editor Header Card: Name, Color, Search */}
              <Card className="rounded-2xl border border-border shadow-xs bg-card/60 backdrop-blur-xs">
                <CardHeader className="p-4 pb-3 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ColorPickerPopover
                        color={color}
                        onChange={setColor}
                        disabled={isSaving}
                      />
                      <div className="flex-1 min-w-48">
                        <Input
                          type="text"
                          value={roleName}
                          onChange={(e) => setRoleName(e.target.value)}
                          placeholder="Masukkan nama role..."
                          disabled={isSystemAdminRole || isSaving}
                          className="h-9 text-xs sm:text-sm font-semibold rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {isSystemAdminRole && (
                        <Badge
                          variant="secondary"
                          className="gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-xs px-2.5 py-1 rounded-lg"
                        >
                          <Lock className="size-3" />
                          <span>Role Admin Utama</span>
                        </Badge>
                      )}

                      {selectedRole && !isCreatingNew && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2.5 py-1 rounded-lg text-muted-foreground"
                        >
                          {selectedRole.user_count || 0} Pengguna Aktif
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Permission Search Bar & Bulk Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-border/70">
                    <div className="relative flex-1">
                      <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        value={permSearch}
                        onChange={(e) => setPermSearch(e.target.value)}
                        placeholder="Cari modul atau izin..."
                        className="h-8.5 text-xs pl-8.5 rounded-xl"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleEnableAllPermissions}
                        className="h-8.5 text-[11px] px-2.5 rounded-xl gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <CheckCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Aktifkan Semua</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDisableAllPermissions}
                        className="h-8.5 text-[11px] px-2.5 rounded-xl gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <XCircle className="size-3.5 text-muted-foreground" />
                        <span>Nonaktifkan Semua</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Permissions Matrix Sections */}
              <div className="space-y-3.5">
                {filteredModules.map(([moduleKey, config]) => {
                  const Icon = MODULE_ICONS[moduleKey] || Sparkles
                  const actionKeys = Object.keys(config.actions)
                  const modPermissions = permissions[moduleKey] || {}

                  const allEnabled = actionKeys.every((a) => !!modPermissions[a])

                  return (
                    <Card
                      key={moduleKey}
                      className="rounded-2xl border border-border shadow-xs bg-card/60 backdrop-blur-xs overflow-hidden"
                    >
                      <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between space-y-0 border-b border-border/50 bg-muted/20">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <CardTitle className="text-xs sm:text-sm font-bold tracking-tight">
                              {config.title}
                            </CardTitle>
                            <CardDescription className="text-[11px] line-clamp-1">
                              {config.description}
                            </CardDescription>
                          </div>
                        </div>

                        {/* Toggle All in Module */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
                            {allEnabled ? "Matikan Modul" : "Aktifkan Modul"}
                          </span>
                          <Switch
                            checked={allEnabled}
                            onCheckedChange={() => toggleAllModule(moduleKey, actionKeys)}
                            title={allEnabled ? "Nonaktifkan seluruh izin modul" : "Aktifkan seluruh izin modul"}
                          />
                        </div>
                      </CardHeader>

                      <CardContent className="p-3 divide-y divide-border/40">
                        {Object.entries(config.actions).map(([actionKey, actionConfig]) => {
                          const isChecked = !!modPermissions[actionKey]

                          return (
                            <div
                              key={actionKey}
                              className="flex items-center justify-between py-2.5 px-2 rounded-xl transition-colors hover:bg-muted/40 gap-3"
                            >
                              <div className="min-w-0 flex flex-col">
                                <span className="text-xs font-semibold text-foreground">
                                  {actionConfig.label}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {actionConfig.description}
                                </span>
                              </div>

                              <Switch
                                checked={isChecked}
                                onCheckedChange={() =>
                                  togglePermission(moduleKey, actionKey, actionKeys)
                                }
                              />
                            </div>
                          )
                        })}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Sticky Action Footer */}
              <div className="sticky bottom-4 z-20 flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-card/90 border border-border shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-2">
                  {isDirty ? (
                    <Badge
                      variant="outline"
                      className="text-[11px] px-2 py-0.5 rounded-lg border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium"
                    >
                      Perubahan Belum Disimpan
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      Data role tersimpan
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={!isDirty || isSaving}
                    className="rounded-xl h-9 px-3 text-xs gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>Batal</span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveRole}
                    disabled={isSaving || !roleName.trim()}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-9 px-4"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="size-3.5" />
                        <span>Simpan Perubahan</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="size-5" />
              <span>Hapus Role &quot;{roleToDelete?.name}&quot;?</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Apakah Anda yakin ingin menghapus role ini? Role yang dihapus tidak akan dapat
              diberikan lagi kepada pengguna baru.
            </DialogDescription>
          </DialogHeader>

          {roleToDelete && (roleToDelete.user_count || 0) > 0 && (
            <div className="p-3 text-xs rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200">
              Perhatian: Role ini saat ini masih terikat dengan{" "}
              <strong>{roleToDelete.user_count} pengguna aktif</strong>. Anda harus mengubah role pengguna tersebut terlebih dahulu sebelum dapat menghapusnya.
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-xl h-9 text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={deleteRoleMutation.isPending || (roleToDelete?.user_count || 0) > 0}
              className="rounded-xl h-9 text-xs cursor-pointer"
            >
              {deleteRoleMutation.isPending ? "Menghapus..." : "Ya, Hapus Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
