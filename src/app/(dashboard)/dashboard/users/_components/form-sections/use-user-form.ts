"use client"

import * as React from "react"
import type { UserItem, CreateUserPayload, UpdateUserPayload } from "@/types/user"
import type { Role } from "@/types/role"

interface UseUserFormProps {
  editingUser: UserItem | null
  roles: Role[]
  myCompanyId?: string | null
  onClose: () => void
  onSave: (payload: {
    isEdit: boolean
    payload: CreateUserPayload | UpdateUserPayload
    name: string
  }) => Promise<void>
}

export function useUserForm({
  editingUser,
  roles,
  myCompanyId,
  onClose,
  onSave,
}: UseUserFormProps) {
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
          department_id: formDeptID || null,
          company_id: formCompanyID || null,
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
          department_id: formDeptID || null,
          company_id: formCompanyID || null,
          status: formStatus,
        }
        await onSave({ isEdit: false, payload, name: formName })
      }
      onClose()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan data pengguna.")
    }
  }

  return {
    formName, setFormName,
    formEmail, setFormEmail,
    formPassword, setFormPassword,
    formRoleID, setFormRoleID,
    formDeptID, setFormDeptID,
    formCompanyID, setFormCompanyID,
    formStatus, setFormStatus,
    formError,
    handleSubmit,
  }
}
