"use client"

import * as React from "react"
import { CheckCircle2, AlertCircle, X } from "lucide-react"

export interface PageNotice {
  type: "success" | "error"
  text: string
}

interface CompanyNoticeProps {
  notice: PageNotice | null
  onClose: () => void
}

export function CompanyNotice({ notice, onClose }: CompanyNoticeProps) {
  if (!notice) return null

  const isSuccess = notice.type === "success"

  return (
    <div
      role="alert"
      className={`relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
        isSuccess
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
          : "bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {isSuccess ? (
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <AlertCircle className="size-5 shrink-0 text-rose-600 dark:text-rose-400" />
        )}
        <span className="font-medium">{notice.text}</span>
      </div>

      <button
        onClick={onClose}
        type="button"
        className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-opacity"
        aria-label="Tutup notifikasi"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
