"use client"

import * as React from "react"
import { UserPlus, UserCog, AlertCircle, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  FormDrawer,
  FormDrawerHeader,
  FormDrawerBody,
  FormDrawerFooter,
} from "@/components/shared/form-drawer"
import type { UserItem, CreateUserPayload, UpdateUserPayload } from "@/types/user"
import type { Role } from "@/types/role"
import type { Department } from "@/types/department"
import type { Company } from "@/types/company"
import { useUserForm } from "./form-sections/use-user-form"
import { UserCredentialsSection } from "./form-sections/user-credentials-section"
import { UserRoleSection } from "./form-sections/user-role-section"
import { UserAffiliationSection } from "./form-sections/user-affiliation-section"

type UserFormSaveHandler = (payload: {
  isEdit: boolean
  payload: CreateUserPayload | UpdateUserPayload
  name: string
}) => Promise<void>

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
  onSave: UserFormSaveHandler
}

function UserFormDrawerContent({
  editingUser,
  roles,
  departments,
  isAdmin,
  isIndustri,
  myCompanyId,
  isSaving,
  onClose,
  onSave,
}: Omit<UserFormDrawerProps, "open" | "onOpenChange"> & { onClose: () => void }) {
  const form = useUserForm({ editingUser, roles, myCompanyId, onClose, onSave })

  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col h-full">
      <FormDrawerHeader
        title={editingUser ? `Ubah Akun: ${editingUser.name}` : "Tambah Pengguna Baru"}
        description={
          editingUser
            ? "Perbarui informasi akun, hak akses role, penugasan jurusan, atau status."
            : "Daftarkan akun baru ke dalam sistem dengan kredensial masuk dan hak akses."
        }
        icon={editingUser ? <UserCog className="size-5" /> : <UserPlus className="size-5" />}
        badge={
          <Badge variant={editingUser ? "outline" : "default"} className={`text-[10px] font-semibold ${!editingUser ? "bg-blue-600 text-white" : ""}`}>
            {editingUser ? "Mode Edit" : "Akun Baru"}
          </Badge>
        }
        onClose={onClose}
      />

      <FormDrawerBody>
        {form.formError && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2.5">
            <AlertCircle className="size-4.5 shrink-0" />
            <span className="font-medium">{form.formError}</span>
          </div>
        )}

        <UserCredentialsSection
          formName={form.formName} setFormName={form.setFormName}
          formEmail={form.formEmail} setFormEmail={form.setFormEmail}
          formPassword={form.formPassword} setFormPassword={form.setFormPassword}
          isEdit={Boolean(editingUser)}
        />

        <UserRoleSection
          formRoleID={form.formRoleID} setFormRoleID={form.setFormRoleID}
          formStatus={form.formStatus} setFormStatus={form.setFormStatus}
          roles={roles}
        />

        <UserAffiliationSection
          formDeptID={form.formDeptID} setFormDeptID={form.setFormDeptID}
          formDeptIDs={form.formDeptIDs} setFormDeptIDs={form.setFormDeptIDs}
          isMultiDeptRole={form.isMultiDeptRole}
          isStudentRole={form.isStudentRole}
          formCompanyID={form.formCompanyID} setFormCompanyID={form.setFormCompanyID}
          formParentID={form.formParentID} setFormParentID={form.setFormParentID}
          formParentName={form.formParentName} setFormParentName={form.setFormParentName}
          departments={departments}
          isAdmin={isAdmin}
          isIndustri={isIndustri}
        />
      </FormDrawerBody>

      <FormDrawerFooter
        onCancel={onClose}
        isSaving={isSaving}
        saveText={editingUser ? "Simpan Perubahan" : "Tambah Pengguna"}
        saveIcon={<Save className="size-3.5 mr-1.5" />}
      />
    </form>
  )
}

export const UserFormDrawer = React.memo(function UserFormDrawer(props: UserFormDrawerProps) {
  const { open, onOpenChange, editingUser } = props
  return (
    <FormDrawer open={open} onOpenChange={onOpenChange} size="xl">
      {open && (
        <UserFormDrawerContent
          key={editingUser?.id ?? "new-user"}
          {...props}
          onClose={() => onOpenChange(false)}
        />
      )}
    </FormDrawer>
  )
})
