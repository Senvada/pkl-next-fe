"use client"

import * as React from "react"
import { Save, RotateCcw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SettingsHeaderProps {
  isSaving: boolean
  onSave: () => void
  onReset: () => void
}

export function SettingsHeader({
  isSaving,
  onSave,
  onReset,
}: SettingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Pengaturan Sistem
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Kelola konfigurasi umum instansi, ketentuan penerimaan PKL, notifikasi, dan integrasi sistem.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={isSaving}
          className="gap-2 rounded-xl border-border/80 text-xs sm:text-sm font-medium cursor-pointer"
        >
          <RotateCcw className="size-3.5 text-muted-foreground" />
          <span>Reset Default</span>
        </Button>

        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="size-4" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
