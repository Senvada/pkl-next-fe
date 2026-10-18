"use client"

import * as React from "react"
import {
  UserPlus,
  UserCog,
  AlertCircle,
  Save,
  ShieldCheck,
  GraduationCap,
  Lock,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  FormDrawer,
  FormDrawerHeader,
  FormDrawerBody,
  FormDrawerSection,
  FormDrawerFooter,
} from "@/components/shared/form-drawer"
import type { UserItem, CreateUserPayload, UpdateUserPayload } from "@/types/user"
import type { Role } from "@/types/role"
import type { Department } from "@/types/department"
import type { Company } from "@/types/company"

interface UserFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingUser: UserItem | null
  roles: Role[]
  departments: Department[]
  companies: Company[]
  isAdmin: boolean
  isIndustri: boolean
  myCompanyId?: string | null
  isSaving: boolean
  onSave: (payload: {
    isEdit: boolean
    payload: CreateUserPayload | UpdateUserPayload
    name: string
  }) => Promise<void>
}

function UserFormDrawerContent({
  editingUser,
  roles,
  departments,
  companies,
  isAdmin,
  isIndustri,
  myCompanyId,
  isSaving,
  onClose,
  onSave,
}: {
  editingUser: UserItem | null
  roles: Role[]
  departments: Department[]
  companies: Company[]
  isAdmin: boolean
  isIndustri: boolean
  myCompanyId?: string | null
  isSaving: boolean
  onClose: () => void
  onSave: (payload: {
    isEdit: boolean
    payload: CreateUserPayload | UpdateUserPayload
    name: string
  }) => Promise<void>
}) {
  const defaultRole = React.useMemo(() => {
    return (
      roles.find((r) => r.name.toLowerCase() === "siswa") ||
      roles.find((r) => r.name.toLowerCase() !== "admin") ||
      roles[0]
    )
  }, [roles])

  const [formName, setFormName] = React.useState(editingUser ? editingUser.name : "")
  const [formEmail, setFormEmail] = React.useState(editingUser ? editingUser.email : "")
  const [formPassword, setFormPassword] = React.useState("")
  const [formRoleID, setFormRoleID] = React.useState(
    editingUser ? editingUser.role_id : defaultRole?.id || ""
  )
  const [formDeptID, setFormDeptID] = React.useState(
    editingUser ? editingUser.department_id || "" : ""
  )
  const [formCompanyID, setFormCompanyID] = React.useState(
    editingUser ? editingUser.company_id || "" : myCompanyId || ""
  )
  const [formStatus, setFormStatus] = React.useState<string>(
    editingUser ? editingUser.status || "active" : "active"
  )
  const [formError, setFormError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formName.trim()) return setFormError("Nama lengkap wajib diisi")
    if (!formEmail.trim()) return setFormError("Alamat email wajib diisi")
    if (!editingUser && !formPassword) {
      return setFormError("Kata sandi wajib diisi untuk pengguna baru")
    }
    if (formPassword && formPassword.length < 6) {
      return setFormError("Kata sandi minimal 6 karakter")
    }
    if (!formRoleID) return setFormError("Role pengguna wajib dipilih")

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
        if (formPassword) payload.password = formPassword
        await onSave({ isEdit: true, payload, name: formName })
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
        await onSave({ isEdit: false, payload, name: formName })
      }
      onClose()
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Gagal menyimpan data pengguna."
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Header */}
      <FormDrawerHeader
        title={editingUser ? `Ubah Akun: ${editingUser.name}` : "Tambah Pengguna Baru"}
        description={
          editingUser
            ? "Perbarui informasi akun, hak akses role, penugasan jurusan, atau status."
            : "Daftarkan akun baru ke dalam sistem dengan kredensial masuk dan hak akses."
        }
        icon={
          editingUser ? (
            <UserCog className="size-5" />
          ) : (
            <UserPlus className="size-5" />
          )
        }
        badge={
          editingUser ? (
            <Badge variant="outline" className="text-[10px] font-semibold">
              Mode Edit
            </Badge>
          ) : (
            <Badge className="bg-blue-600 text-white text-[10px] font-semibold">
              Akun Baru
            </Badge>
          )
        }
        onClose={onClose}
      />

      {/* Body with Sections */}
      <FormDrawerBody>
        {formError && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2.5">
            <AlertCircle className="size-4.5 shrink-0" />
            <span className="font-medium">{formError}</span>
          </div>
        )}

        {/* Section 1: Identitas & Kredensial Masuk */}
        <FormDrawerSection
          step={1}
          title="Identitas & Kredensial Masuk"
          description="Informasi dasar yang digunakan oleh pengguna untuk masuk ke portal."
        >
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nama Lengkap <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="h-9.5 text-xs rounded-xl"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Alamat Email Resmi <span className="text-destructive">*</span>
            </label>
            <Input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="nama@smkn6malang.sch.id"
              className="h-9.5 text-xs rounded-xl"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Lock className="size-3 text-slate-400" />
                <span>Kata Sandi Masuk</span>
                {!editingUser && <span className="text-destructive">*</span>}
              </label>
              {editingUser && (
                <span className="text-[11px] text-muted-foreground">
                  Kosongkan jika tidak ingin mengubah sandi
                </span>
              )}
            </div>
            <Input
              type="password"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              placeholder={editingUser ? "••••••••" : "Minimal 6 karakter"}
              className="h-9.5 text-xs rounded-xl"
              required={!editingUser}
            />
          </div>
        </FormDrawerSection>

        {/* Section 2: Otorisasi & Peran Pengguna */}
        <FormDrawerSection
          step={2}
          title="Otorisasi & Status Akun"
          description="Menentukan batasan izin akses modul dan status keaktifan akun di sistem."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-blue-500" />
                <span>Role / Hak Akses</span>
                <span className="text-destructive">*</span>
              </label>
              <select
                value={formRoleID}
                onChange={(e) => setFormRoleID(e.target.value)}
                className="w-full h-9.5 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
                required
              >
                <option value="" disabled>Pilih Role Pengguna</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Status Keaktifan
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className="w-full h-9.5 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                <option value="active">Aktif (Dapat Masuk)</option>
                <option value="waiting">Menunggu Verifikasi</option>
                <option value="inactive">Nonaktif</option>
                <option value="banned">Diblokir / Ditangguhkan</option>
              </select>
            </div>
          </div>
        </FormDrawerSection>

        {/* Section 3: Afiliasi Jurusan & Tempat PKL */}
        <FormDrawerSection
          step={3}
          title="Afiliasi Jurusan & Industri Mitra"
          description="Hubungkan pengguna dengan program keahlian atau perusahaan tempat magang."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="size-3.5 text-emerald-500" />
                <span>Jurusan / Program Keahlian</span>
              </label>
              <select
                value={formDeptID}
                onChange={(e) => setFormDeptID(e.target.value)}
                className="w-full h-9.5 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                <option value="">Tidak Ditentukan / Umum</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Industri / Mitra PKL
              </label>
              <select
                value={formCompanyID}
                onChange={(e) => setFormCompanyID(e.target.value)}
                disabled={!isAdmin && isIndustri}
                className="w-full h-9.5 text-xs rounded-xl border border-input bg-background px-3 text-foreground cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring disabled:opacity-60"
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
                  Terkunci otomatis pada industri Anda
                </span>
              )}
            </div>
          </div>
        </FormDrawerSection>
      </FormDrawerBody>

      {/* Sticky Footer */}
      <FormDrawerFooter
        onCancel={onClose}
        isSaving={isSaving}
        saveText={editingUser ? "Simpan Perubahan" : "Tambah Pengguna"}
        saveIcon={<Save className="size-3.5 mr-1.5" />}
      />
    </form>
  )
}

export const UserFormDrawer = React.memo(function UserFormDrawer({
  open,
  onOpenChange,
  editingUser,
  roles,
  departments,
  companies,
  isAdmin,
  isIndustri,
  myCompanyId,
  isSaving,
  onSave,
}: UserFormDrawerProps) {
  const handleClose = React.useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <FormDrawer open={open} onOpenChange={onOpenChange} size="xl">
      {open && (
        <UserFormDrawerContent
          key={editingUser?.id ?? "new-user"}
          editingUser={editingUser}
          roles={roles}
          departments={departments}
          companies={companies}
          isAdmin={isAdmin}
          isIndustri={isIndustri}
          myCompanyId={myCompanyId}
          isSaving={isSaving}
          onClose={handleClose}
          onSave={onSave}
        />
      )}
    </FormDrawer>
  )
})
