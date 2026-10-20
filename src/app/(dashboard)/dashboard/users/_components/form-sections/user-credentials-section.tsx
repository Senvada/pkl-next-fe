"use client"

import * as React from "react"
import { Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FormDrawerSection } from "@/components/shared/form-drawer"

interface UserCredentialsSectionProps {
  formName: string
  setFormName: (v: string) => void
  formEmail: string
  setFormEmail: (v: string) => void
  formPassword: string
  setFormPassword: (v: string) => void
  isEdit: boolean
}

export function UserCredentialsSection({
  formName,
  setFormName,
  formEmail,
  setFormEmail,
  formPassword,
  setFormPassword,
  isEdit,
}: UserCredentialsSectionProps) {
  return (
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
            {!isEdit && <span className="text-destructive">*</span>}
          </label>
          {isEdit && (
            <span className="text-[11px] text-muted-foreground">
              Kosongkan jika tidak ingin mengubah sandi
            </span>
          )}
        </div>
        <Input
          type="password"
          value={formPassword}
          onChange={(e) => setFormPassword(e.target.value)}
          placeholder={isEdit ? "••••••••" : "Minimal 6 karakter"}
          className="h-9.5 text-xs rounded-xl"
          required={!isEdit}
        />
      </div>
    </FormDrawerSection>
  )
}
