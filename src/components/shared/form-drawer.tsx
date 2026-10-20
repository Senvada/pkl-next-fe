"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export { FormDrawerHeader, type FormDrawerHeaderProps } from "./form-drawer/form-drawer-header"
export { FormDrawerSection, type FormDrawerSectionProps } from "./form-drawer/form-drawer-section"
export { FormDrawerFooter, type FormDrawerFooterProps } from "./form-drawer/form-drawer-footer"

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
