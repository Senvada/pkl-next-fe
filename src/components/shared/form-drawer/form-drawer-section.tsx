"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

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
