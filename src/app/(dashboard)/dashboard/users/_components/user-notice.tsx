import * as React from "react"
import { CheckCircle2, AlertCircle, X } from "lucide-react"

export interface PageNotice {
  type: "success" | "error"
  text: string
}

interface UserNoticeProps {
  notice: PageNotice | null
  onClose: () => void
}

export const UserNotice = React.memo(function UserNotice({ notice, onClose }: UserNoticeProps) {
  if (!notice) return null

  const isSuccess = notice.type === "success"

  return (
    <div
      className={`shrink-0 flex items-center justify-between gap-2 p-3 text-xs rounded-xl border transition-colors duration-150 ease-out ${
        isSuccess
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
          : "bg-destructive/10 text-destructive border-destructive/20"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {isSuccess ? (
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <AlertCircle className="size-4 shrink-0 text-destructive" />
        )}
        <span className="truncate">{notice.text}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
})
