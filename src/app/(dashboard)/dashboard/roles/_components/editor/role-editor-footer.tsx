import * as React from "react"
import { RotateCcw, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RoleEditorFooterProps {
  isDirty: boolean
  isSaving: boolean
  canSave: boolean
  onReset: () => void
  onSave: () => void
}

export const RoleEditorFooter = React.memo(function RoleEditorFooter({
  isDirty,
  isSaving,
  canSave,
  onReset,
  onSave,
}: RoleEditorFooterProps) {
  return (
    <div className="shrink-0 p-3 sm:p-3.5 border-t border-border/70 bg-card/95 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {isDirty ? (
          <Badge
            variant="outline"
            className="text-[11px] px-2 py-0.5 rounded-lg border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium"
          >
            Perubahan Belum Disimpan
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Data role tersimpan
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={!isDirty || isSaving}
          className="rounded-xl h-8.5 px-3 text-xs gap-1.5 cursor-pointer disabled:opacity-40"
        >
          <RotateCcw className="size-3.5" />
          <span>Batal</span>
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={onSave}
          disabled={isSaving || !canSave}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-8.5 px-3.5 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
})
