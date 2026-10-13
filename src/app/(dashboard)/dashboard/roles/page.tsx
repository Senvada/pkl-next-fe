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
  AlertTriangle,
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
  X,
  RefreshCw,
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
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

// Normalize hex color for reliable comparison
function areColorsEqual(c1?: string, c2?: string): boolean {
  const norm1 = (c1 || "#3B82F6").trim().toUpperCase()
  const norm2 = (c2 || "#3B82F6").trim().toUpperCase()
  return norm1 === norm2
}

// Deep boolean comparison of permissions across all known modules and actions
function arePermissionsEqual(a?: RolesPermission, b?: RolesPermission): boolean {
  if (a === b) return true
  if (!a || !b) return false

  for (const [modKey, modConfig] of Object.entries(MODULES_CONFIG)) {
    for (const actKey of Object.keys(modConfig.actions)) {
      const valA = !!a[modKey]?.[actKey]
      const valB = !!b[modKey]?.[actKey]
      if (valA !== valB) return false
    }
  }
  return true
}

type PendingNavigation =
  | { type: "select_role"; role: Role }
  | { type: "create_new" }
  | { type: "back_mobile" }

export default function RolesManagementPage() {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const {
    data: roles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useRolesQuery()

  const createRoleMutation = useCreateRole()
  const updateRoleMutation = useUpdateRole()
  const deleteRoleMutation = useDeleteRole()

  const isSaving = createRoleMutation.isPending || updateRoleMutation.isPending
  const isDeleting = deleteRoleMutation.isPending
  const isBusy = isSaving || isDeleting

  // Selected Role ID & Creating New state
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(null)
  const [isCreatingNew, setIsCreatingNew] = React.useState(false)

  // Search state for role list
  const [roleSearch, setRoleSearch] = React.useState("")

  // Unsaved changes confirmation dialog
  const isEditorDirtyRef = React.useRef<() => boolean>(() => false)
  const [pendingNavigation, setPendingNavigation] =
    React.useState<PendingNavigation | null>(null)
  const [unsavedDialogOpen, setUnsavedDialogOpen] = React.useState(false)

  // Delete modal state
  const [roleToDelete, setRoleToDelete] = React.useState<Role | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)

  // Page level notification banner
  const [pageNotice, setPageNotice] = React.useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  // Mobile view toggle (shows editor on mobile if a role is selected)
  const [mobileEditorOpen, setMobileEditorOpen] = React.useState(false)

  // Active role reference is derived without any effect
  const activeRoleId = isCreatingNew ? null : (selectedRoleId ?? roles[0]?.id ?? null)
  const selectedRole = isCreatingNew
    ? null
    : roles.find((r) => r.id === activeRoleId) || roles[0] || null

  // 1. SELECT ROLE WITH UNSAVED CHANGES GUARD
  const handleSelectRole = (role: Role) => {
    if (isBusy) return
    if (!isCreatingNew && selectedRole?.id === role.id) {
      setMobileEditorOpen(true)
      return
    }

    if (isEditorDirtyRef.current()) {
      setPendingNavigation({ type: "select_role", role })
      setUnsavedDialogOpen(true)
      return
    }

    applySelectRole(role)
  }

  const applySelectRole = (role: Role) => {
    setSelectedRoleId(role.id || null)
    setIsCreatingNew(false)
    setMobileEditorOpen(true)
    setPageNotice(null)
  }

  // 2. START CREATE ROLE WITH UNSAVED CHANGES GUARD
  const handleStartCreateRole = () => {
    if (isBusy) return
    if (isCreatingNew) {
      setMobileEditorOpen(true)
      return
    }

    if (isEditorDirtyRef.current()) {
      setPendingNavigation({ type: "create_new" })
      setUnsavedDialogOpen(true)
      return
    }

    applyStartCreateRole()
  }

  const applyStartCreateRole = () => {
    setSelectedRoleId(null)
    setIsCreatingNew(true)
    setMobileEditorOpen(true)
    setPageNotice(null)
  }

  // 3. MOBILE BACK WITH UNSAVED CHANGES GUARD
  const handleMobileBack = () => {
    if (isEditorDirtyRef.current()) {
      setPendingNavigation({ type: "back_mobile" })
      setUnsavedDialogOpen(true)
      return
    }

    setMobileEditorOpen(false)
  }

  // 4. CONFIRM DISCARD IN UNSAVED DIALOG
  const handleConfirmDiscard = () => {
    setUnsavedDialogOpen(false)
    if (!pendingNavigation) return

    if (pendingNavigation.type === "select_role") {
      applySelectRole(pendingNavigation.role)
    } else if (pendingNavigation.type === "create_new") {
      applyStartCreateRole()
    } else if (pendingNavigation.type === "back_mobile") {
      setMobileEditorOpen(false)
    }
    setPendingNavigation(null)
  }

  const handleCancelDiscard = () => {
    setUnsavedDialogOpen(false)
    setPendingNavigation(null)
  }

  // 5. PROMPT DELETE DIALOG
  const promptDeleteRole = (e: React.MouseEvent, role: Role) => {
    e.stopPropagation()
    if (isBusy) return
    setRoleToDelete(role)
    setDeleteModalOpen(true)
  }

  // 6. CONFIRM DELETE EXECUTION
  const handleConfirmDelete = async () => {
    if (!roleToDelete || !roleToDelete.id || isBusy) return

    try {
      await deleteRoleMutation.mutateAsync(roleToDelete.id)
      setDeleteModalOpen(false)

      // Fallback selection if active role was deleted
      if (selectedRoleId === roleToDelete.id) {
        const remainingRoles = roles.filter((r) => r.id !== roleToDelete.id)
        setSelectedRoleId(remainingRoles[0]?.id || null)
        setIsCreatingNew(false)
      }

      setPageNotice({
        type: "success",
        text: `Role "${roleToDelete.name}" berhasil dihapus.`,
      })
      setRoleToDelete(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus role."
      setPageNotice({ type: "error", text: msg })
      setDeleteModalOpen(false)
    }
  }

  // Filter roles list
  const filteredRoles = React.useMemo(() => {
    if (!roleSearch.trim()) return roles
    const q = roleSearch.toLowerCase()
    return roles.filter((r) => r.name.toLowerCase().includes(q))
  }, [roles, roleSearch])

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full max-w-7xl mx-auto">
      {/* 1. PINNED PAGE HEADER (Never scrolls away) */}
      <div className="shrink-0 mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="size-4.5 sm:size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Hak Akses &amp; Role
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola tingkatan role dan matriks izin aksi modul sistem secara terpusat dan fleksibel.
          </p>
        </div>

        <Button
          onClick={handleStartCreateRole}
          disabled={isBusy}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-8.5 sm:h-9 px-3.5 self-start sm:self-auto disabled:opacity-50"
        >
          <Plus className="size-4" />
          <span>Tambah Role Baru</span>
        </Button>
      </div>

      {/* Page-level Notice Banner (Dismissable) */}
      {pageNotice && (
        <div
          className={`shrink-0 mb-3 flex items-center justify-between gap-2 p-2.5 sm:p-3 text-xs rounded-xl border transition-all ${
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
            title="Tutup pemberitahuan"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* 2. MAIN SPLIT CONTAINER (Takes remaining height, inner panes scroll) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
        {/* Left Column: Role List */}
        <div
          className={`lg:col-span-4 xl:col-span-4 flex flex-col h-full min-h-0 ${
            mobileEditorOpen ? "hidden lg:flex" : "flex"
          }`}
        >
          <Card className="rounded-2xl border border-border shadow-xs bg-card/60 flex flex-col h-full min-h-0 overflow-hidden">
            {/* Header: Title and Search (Fixed) */}
            <CardHeader className="p-3.5 pb-2.5 space-y-2 shrink-0 border-b border-border/50">
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
                  disabled={isBusy}
                  className="h-8.5 text-xs pl-8.5 rounded-xl"
                />
              </div>
            </CardHeader>

            {/* Scrollable Role List Container */}
            <CardContent className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2 space-y-1">
              {(!mounted || isLoading) && (
                <div className="space-y-2 p-2">
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              )}

              {isError && mounted && (
                <div className="p-4 text-center text-xs text-destructive flex flex-col items-center gap-2">
                  <AlertCircle className="size-5" />
                  <span>
                    {error instanceof Error
                      ? error.message
                      : "Gagal memuat daftar role dari server."}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    className="h-7 text-xs rounded-lg gap-1.5 cursor-pointer mt-1"
                  >
                    <RefreshCw className="size-3" />
                    <span>Coba Lagi</span>
                  </Button>
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
                  const isSelected = !isCreatingNew && role.id === selectedRole?.id
                  const isAdmin = role.name.toLowerCase() === "admin"

                  return (
                    <div
                      key={role.id}
                      onClick={() => handleSelectRole(role)}
                      className={`group relative flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600/10 border-blue-500/40 text-foreground shadow-xs dark:bg-blue-500/15"
                          : "border-transparent hover:bg-muted/50 text-foreground"
                      } ${isBusy ? "pointer-events-none opacity-60" : ""}`}
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
                            disabled={isBusy}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer disabled:pointer-events-none"
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
          className={`lg:col-span-8 xl:col-span-8 flex flex-col h-full min-h-0 ${
            !mobileEditorOpen ? "hidden lg:flex" : "flex"
          }`}
        >
          {!selectedRole && !isCreatingNew ? (
            <Card className="rounded-2xl border border-dashed border-border p-8 text-center bg-card/40 flex flex-col items-center justify-center h-full min-h-0">
              <div className="size-14 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <ShieldCheck className="size-7 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                Pilih atau Buat Role Baru
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
                Pilih salah satu role dari panel sebelah kiri untuk menyesuaikan izin akses, atau klik tombol di bawah untuk menambahkan role baru.
              </p>
              <Button
                onClick={handleStartCreateRole}
                disabled={isBusy}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-8.5 px-3.5"
              >
                <Plus className="size-3.5" />
                <span>Buat Role Baru</span>
              </Button>
            </Card>
          ) : (
            <RoleEditor
              key={isCreatingNew ? "new" : selectedRole?.id || "empty"}
              role={selectedRole}
              allRoles={roles}
              isCreatingNew={isCreatingNew}
              isParentBusy={isBusy}
              onBack={handleMobileBack}
              onSaved={(saved, isNew) => {
                if (isNew) {
                  setIsCreatingNew(false)
                  if (saved.id) {
                    setSelectedRoleId(saved.id)
                  }
                  setPageNotice({
                    type: "success",
                    text: `Role "${saved.name}" berhasil dibuat dan siap digunakan!`,
                  })
                }
              }}
              onCancelNew={() => {
                setIsCreatingNew(false)
                if (roles.length > 0) {
                  setSelectedRoleId(roles[0].id || null)
                }
                setPageNotice({
                  type: "success",
                  text: "Pembuatan role baru dibatalkan.",
                })
              }}
              onRegisterDirtyChecker={(fn) => {
                isEditorDirtyRef.current = fn
              }}
            />
          )}
        </div>
      </div>

      {/* 3. UNSAVED CHANGES CONFIRMATION DIALOG */}
      <Dialog open={unsavedDialogOpen} onOpenChange={setUnsavedDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-5 shrink-0" />
              <span>Perubahan Belum Disimpan</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              {isCreatingNew
                ? "Anda sedang membuat role baru yang belum disimpan. Jika berpindah sekarang, data yang telah diisi akan dibuang."
                : `Anda memiliki perubahan pada role "${selectedRole?.name || "ini"}" yang belum disimpan. Jika berpindah sekarang, semua perubahan yang belum disimpan akan hilang.`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelDiscard}
              className="rounded-xl h-9 text-xs cursor-pointer"
            >
              Tetap di Sini
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmDiscard}
              className="rounded-xl h-9 text-xs cursor-pointer bg-amber-600 hover:bg-amber-700 text-white"
            >
              Buang Perubahan &amp; Lanjut
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. DELETE CONFIRMATION MODAL */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="size-5 shrink-0" />
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
              disabled={isDeleting || (roleToDelete?.user_count || 0) > 0}
              className="rounded-xl h-9 text-xs cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  <span>Menghapus...</span>
                </>
              ) : (
                "Ya, Hapus Role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface RoleEditorProps {
  role: Role | null
  allRoles: Role[]
  isCreatingNew: boolean
  isParentBusy: boolean
  onBack: () => void
  onSaved: (role: Role, isNew: boolean) => void
  onCancelNew: () => void
  onRegisterDirtyChecker: (fn: () => boolean) => void
}

function RoleEditor({
  role,
  allRoles,
  isCreatingNew,
  isParentBusy,
  onBack,
  onSaved,
  onCancelNew,
  onRegisterDirtyChecker,
}: RoleEditorProps) {
  const createRoleMutation = useCreateRole()
  const updateRoleMutation = useUpdateRole()

  // Track pristine baseline state to detect changes reliably
  const [baseline, setBaseline] = React.useState(() => ({
    name: role?.name || "",
    color: role?.color || "#3B82F6",
    permissions: role?.permissions || createEmptyPermissions(),
  }))

  const [roleName, setRoleName] = React.useState(role?.name || "")
  const [color, setColor] = React.useState(role?.color || "#3B82F6")
  const [permissions, setPermissions] = React.useState<RolesPermission>(
    role?.permissions || createEmptyPermissions()
  )
  const [permSearch, setPermSearch] = React.useState("")
  const [notice, setNotice] = React.useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const isSystemAdminRole = role?.name.toLowerCase() === "admin"
  const isSaving =
    createRoleMutation.isPending || updateRoleMutation.isPending || isParentBusy

  // Compute dirty state using robust comparator functions
  const isDirty = React.useMemo(() => {
    if (isCreatingNew) {
      return (
        roleName.trim().length > 0 ||
        !areColorsEqual(color, "#3B82F6") ||
        !arePermissionsEqual(permissions, createEmptyPermissions())
      )
    }
    return (
      roleName.trim() !== baseline.name.trim() ||
      !areColorsEqual(color, baseline.color) ||
      !arePermissionsEqual(permissions, baseline.permissions)
    )
  }, [isCreatingNew, baseline, roleName, color, permissions])

  // Register dirty getter with parent (ref only, no state cascading)
  React.useEffect(() => {
    onRegisterDirtyChecker(() => isDirty)
  }, [isDirty, onRegisterDirtyChecker])

  React.useEffect(() => {
    return () => {
      onRegisterDirtyChecker(() => false)
    }
  }, [onRegisterDirtyChecker])

  // Reset or cancel changes
  const handleReset = () => {
    if (isSaving) return

    if (isCreatingNew) {
      onCancelNew()
    } else {
      setRoleName(baseline.name)
      setColor(baseline.color)
      setPermissions(baseline.permissions)
      setNotice({
        type: "success",
        text: "Perubahan dibatalkan dan dikembalikan ke data awal.",
      })
    }
  }

  // Permission dependency management:
  // - Turning off 'read' turns off all dependent actions in this module
  // - Turning on any action turns on 'read' automatically
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

  const handleEnableAllPermissions = () => {
    setPermissions(createFullPermissions())
  }

  const handleDisableAllPermissions = () => {
    setPermissions(createEmptyPermissions())
  }

  const handleSaveRole = async () => {
    setNotice(null)
    const trimmedName = roleName.trim()

    // 1. Validation: Name required
    if (!trimmedName) {
      setNotice({ type: "error", text: "Nama role wajib diisi." })
      return
    }

    // 2. Validation: Protected "Admin" role check
    if (trimmedName.toLowerCase() === "admin") {
      if (isCreatingNew || (role && role.name.toLowerCase() !== "admin")) {
        setNotice({
          type: "error",
          text: 'Nama "Admin" merupakan role utama sistem dan tidak dapat digunakan.',
        })
        return
      }
    }

    // 3. Validation: Duplicate name check against other existing roles
    const isDuplicate = allRoles.some((r) => {
      if (isCreatingNew) {
        return r.name.toLowerCase() === trimmedName.toLowerCase()
      }
      return r.id !== role?.id && r.name.toLowerCase() === trimmedName.toLowerCase()
    })
    if (isDuplicate) {
      setNotice({
        type: "error",
        text: `Role dengan nama "${trimmedName}" sudah ada. Silakan gunakan nama lain.`,
      })
      return
    }

    try {
      if (isCreatingNew) {
        const created = await createRoleMutation.mutateAsync({
          name: trimmedName,
          color,
          permissions,
        })
        onSaved(created, true)
      } else if (role && role.id) {
        const updated = await updateRoleMutation.mutateAsync({
          id: role.id,
          payload: {
            name: trimmedName,
            color,
            permissions,
          },
        })

        // Update local baseline immediately to clear isDirty cleanly
        setBaseline({
          name: updated.name,
          color: updated.color || "#3B82F6",
          permissions: updated.permissions || createEmptyPermissions(),
        })
        setRoleName(updated.name)
        setColor(updated.color || "#3B82F6")
        setPermissions(updated.permissions || createEmptyPermissions())
        setNotice({
          type: "success",
          text: `Perubahan pada role "${updated.name}" berhasil disimpan!`,
        })
        onSaved(updated, false)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan role ke server."
      setNotice({ type: "error", text: msg })
    }
  }

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

  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card/60 flex flex-col h-full min-h-0 overflow-hidden">
      {/* 1. PINNED EDITOR HEADER (Fixed at top of editor card) */}
      <CardHeader className="p-3.5 sm:p-4 pb-3 space-y-3 shrink-0 border-b border-border/70 bg-card/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile Back Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBack}
              disabled={isSaving}
              className="lg:hidden rounded-xl size-8.5 p-0 shrink-0 cursor-pointer"
              title="Kembali ke Daftar Role"
            >
              <ArrowLeft className="size-4" />
            </Button>

            <ColorPickerPopover
              color={color}
              onChange={setColor}
              disabled={isSaving}
            />
            <div className="flex-1 min-w-36 sm:min-w-48">
              <Input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Masukkan nama role..."
                disabled={isSystemAdminRole || isSaving}
                className="h-8.5 sm:h-9 text-xs sm:text-sm font-semibold rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {isSystemAdminRole && (
              <Badge
                variant="secondary"
                className="gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-xs px-2.5 py-0.5 rounded-lg"
              >
                <Lock className="size-3" />
                <span>Role Admin Utama</span>
              </Badge>
            )}

            {role && !isCreatingNew && (
              <Badge
                variant="outline"
                className="text-xs px-2.5 py-0.5 rounded-lg text-muted-foreground"
              >
                {role.user_count || 0} Pengguna Aktif
              </Badge>
            )}
          </div>
        </div>

        {/* Permission Search & Bulk Toggle Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-border/40">
          <div className="relative flex-1 max-w-xs">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={permSearch}
              onChange={(e) => setPermSearch(e.target.value)}
              placeholder="Cari izin modul..."
              disabled={isSaving}
              className="h-8 text-xs pl-8.5 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleEnableAllPermissions}
              disabled={isSaving}
              className="h-8 text-[11px] rounded-xl px-2.5 gap-1 cursor-pointer"
            >
              <CheckCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>Aktifkan Semua</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDisableAllPermissions}
              disabled={isSaving}
              className="h-8 text-[11px] rounded-xl px-2.5 gap-1 cursor-pointer"
            >
              <XCircle className="size-3 text-muted-foreground" />
              <span>Matikan Semua</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* 2. DEDICATED SCROLLABLE PERMISSIONS CONTAINER */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-3">
        {/* Editor Notice Banner (Dismissable) */}
        {notice && (
          <div
            className={`flex items-center justify-between gap-2 p-2.5 sm:p-3 text-xs rounded-xl border transition-all ${
              notice.type === "success"
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {notice.type === "success" ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="size-4 shrink-0 text-destructive" />
              )}
              <span className="truncate">{notice.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Tutup pemberitahuan"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        {filteredModules.length === 0 && (
          <div className="py-12 text-center text-xs text-muted-foreground">
            Tidak ada modul atau aksi izin yang cocok dengan &quot;{permSearch}&quot;.
          </div>
        )}

        {filteredModules.map(([moduleKey, config]) => {
          const Icon = MODULE_ICONS[moduleKey] || Sparkles
          const actionKeys = Object.keys(config.actions)
          const modPermissions = permissions[moduleKey] || {}
          const allEnabled = actionKeys.every((a) => !!modPermissions[a])

          return (
            <Card
              key={moduleKey}
              className="rounded-xl border border-border shadow-2xs bg-card/40 overflow-hidden"
            >
              <CardHeader className="p-3 sm:p-3.5 pb-2.5 flex flex-row items-center justify-between space-y-0 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-2.5">
                  <div className="size-7 sm:size-8 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Icon className="size-3.5 sm:size-4" />
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

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
                    {allEnabled ? "Matikan Modul" : "Aktifkan Modul"}
                  </span>
                  <Switch
                    checked={allEnabled}
                    onCheckedChange={() => toggleAllModule(moduleKey, actionKeys)}
                    disabled={isSaving}
                    title={allEnabled ? "Nonaktifkan seluruh izin modul" : "Aktifkan seluruh izin modul"}
                  />
                </div>
              </CardHeader>

              <CardContent className="p-2 sm:p-2.5 divide-y divide-border/40">
                {Object.entries(config.actions).map(([actionKey, actionConfig]) => {
                  const isChecked = !!modPermissions[actionKey]

                  return (
                    <div
                      key={actionKey}
                      className="flex items-center justify-between py-2 px-2 rounded-lg transition-colors hover:bg-muted/40 gap-3"
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
                        disabled={isSaving}
                      />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 3. PINNED BOTTOM ACTION BAR (OUTSIDE THE SCROLL CONTAINER!) */}
      <div className="shrink-0 p-3 sm:p-3.5 border-t border-border/70 bg-card/95 flex items-center justify-between gap-3">
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
            className="rounded-xl h-8.5 px-3 text-xs gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <RotateCcw className="size-3.5" />
            <span>Batal</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSaveRole}
            disabled={isSaving || !roleName.trim()}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-8.5 px-3.5 disabled:opacity-50"
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
    </Card>
  )
}
