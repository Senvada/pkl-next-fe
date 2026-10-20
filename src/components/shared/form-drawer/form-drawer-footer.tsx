"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface FormDrawerFooterProps {
  onCancel: () => void
  isSaving?: boolean
  disabled?: boolean
  saveText?: string
  cancelText?: string
  saveIcon?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function FormDrawerFooter({
  onCancel,
  isSaving = false,
  disabled = false,
  saveText = "Simpan Data",
  cancelText = "Batal",
  saveIcon,
  children,
  className,
}: FormDrawerFooterProps) {
  return (
    <div
      className={cn(
        "p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 shrink-0 bg-slate-50/70 dark:bg-white/[0.02]",
        className
      )}
    >
      {children ? (
        children
      ) : (
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
            className="h-9.5 px-4 rounded-xl border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            {cancelText}
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isSaving || disabled}
            className="h-9.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            {isSaving ? <Loader2 className="size-3.5 mr-1.5 animate-spin" /> : saveIcon}
            {isSaving ? "Menyimpan..." : saveText}
          </Button>
        </>
      )}
    </div>
  )
}
