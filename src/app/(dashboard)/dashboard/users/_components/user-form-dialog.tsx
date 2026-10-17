import * as React from "react"
import { Edit3, Plus, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { UserFormFields } from "./user-form-fields"
import type { UserItem, CreateUserPayload, UpdateUserPayload } from "@/types/user"
import type { Role } from "@/types/role"
import type { Department } from "@/types/department"
import type { Company } from "@/types/company"

interface UserFormDialogProps {
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
  onSave: (payload: { isEdit: boolean; payload: CreateUserPayload | UpdateUserPayload; name: string }) => Promise<void>
}

function UserFormContent({
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
  onSave: (payload: { isEdit: boolean; payload: CreateUserPayload | UpdateUserPayload; name: string }) => Promise<void>
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
  const [formRoleID, setFormRoleID] = React.useState(editingUser ? editingUser.role_id : defaultRole?.id || "")
  const [formDeptID, setFormDeptID] = React.useState(editingUser ? editingUser.department_id || "" : "")
  const [formCompanyID, setFormCompanyID] = React.useState(editingUser ? editingUser.company_id || "" : myCompanyId || "")
  const [formStatus, setFormStatus] = React.useState<string>(editingUser ? editingUser.status || "active" : "active")
  const [formError, setFormError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formName.trim()) return setFormError("Nama lengkap wajib diisi")
    if (!formEmail.trim()) return setFormError("Alamat email wajib diisi")
    if (!editingUser && !formPassword) return setFormError("Kata sandi wajib diisi untuk pengguna baru")
    if (formPassword && formPassword.length < 6) return setFormError("Kata sandi minimal 6 karakter")
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
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan data pengguna.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-foreground">
          {editingUser ? <Edit3 className="size-5 text-blue-600" /> : <Plus className="size-5 text-blue-600" />}
          <span>{editingUser ? "Ubah Data Pengguna" : "Tambah Pengguna Baru"}</span>
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

      <UserFormFields
        formName={formName}
        setFormName={setFormName}
        formEmail={formEmail}
        setFormEmail={setFormEmail}
        formPassword={formPassword}
        setFormPassword={setFormPassword}
        formRoleID={formRoleID}
        setFormRoleID={setFormRoleID}
        formDeptID={formDeptID}
        setFormDeptID={setFormDeptID}
        formCompanyID={formCompanyID}
        setFormCompanyID={setFormCompanyID}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        editing={!!editingUser}
        roles={roles}
        departments={departments}
        companies={companies}
        isAdmin={isAdmin}
        isIndustri={isIndustri}
      />

      <DialogFooter className="gap-2 sm:gap-0 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
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
  )
}

export const UserFormDialog = React.memo(function UserFormDialog({
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
}: UserFormDialogProps) {
  const handleClose = React.useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl shadow-none">
        {open && (
          <UserFormContent
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
      </DialogContent>
    </Dialog>
  )
})
