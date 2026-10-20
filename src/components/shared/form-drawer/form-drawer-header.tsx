"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

export interface FormDrawerHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  onClose?: () => void
  className?: string
}

export function FormDrawerHeader({
  title,
  description,
  icon,
  badge,
  onClose,
  className,
}: FormDrawerHeaderProps) {
  return (
    <SheetHeader
      className={cn(
        "p-5 sm:p-6 pb-4 border-b border-slate-200/80 dark:border-white/10 flex flex-row items-start justify-between gap-4 space-y-0 shrink-0 bg-slate-50/50 dark:bg-white/[0.02]",
        className
      )}
    >
      <div className="flex items-start gap-3.5 min-w-0">
        {icon && (
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40 shrink-0 mt-0.5">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <SheetTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
              {title}
            </SheetTitle>
            {badge}
          </div>
          {description && (
            <SheetDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
              {description}
            </SheetDescription>
          )}
        </div>
      </div>

      {onClose && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="size-8 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 shrink-0"
          aria-label="Tutup panel"
        >
          <X className="size-4" />
        </Button>
      )}
    </SheetHeader>
  )
}
