"use client"

import * as React from "react"
import { X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

export interface FormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  size?: "md" | "lg" | "xl" | "2xl" | "full"
  children: React.ReactNode
  className?: string
}

export function FormDrawer({
  open,
  onOpenChange,
  size = "xl",
  children,
  className,
}: FormDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        size={size}
        showCloseButton={false}
        className={cn(
          "p-0 flex flex-col h-full bg-white dark:bg-[#111923] border-l border-slate-200/80 dark:border-white/10 shadow-2xl focus:outline-none sm:max-w-none",
          className
        )}
      >
        {children}
      </SheetContent>
    </Sheet>
  )
}

export interface FormDrawerHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  onClose: () => void
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
    </SheetHeader>
  )
}

export interface FormDrawerBodyProps {
  children: React.ReactNode
  className?: string
}

export function FormDrawerBody({ children, className }: FormDrawerBodyProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 overscroll-contain",
        className
      )}
    >
      {children}
    </div>
  )
}

export interface FormDrawerSectionProps {
  title?: string
  description?: string
  step?: number | string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function FormDrawerSection({
  title,
  description,
  step,
  action,
  children,
  className,
}: FormDrawerSectionProps) {
  return (
    <div
      className={cn(
        "p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/40 dark:bg-white/[0.02] space-y-4 shadow-2xs",
        className
      )}
    >
      {(title || description || step || action) && (
        <div className="flex items-start justify-between gap-3 pb-1 border-b border-slate-200/60 dark:border-white/5">
          <div className="flex items-start gap-2.5">
            {step != null && (
              <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0 mt-0.5">
                {step}
              </span>
            )}
            <div>
              {title && (
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                  {title}
                </h4>
              )}
              {description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="space-y-3.5">{children}</div>
    </div>
  )
}

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
            {isSaving ? (
              <Loader2 className="size-3.5 mr-1.5 animate-spin" />
            ) : (
              saveIcon
            )}
            {isSaving ? "Menyimpan..." : saveText}
          </Button>
        </>
      )}
    </div>
  )
}
