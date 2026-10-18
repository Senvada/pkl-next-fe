import * as React from "react"
import { Sparkles, ChevronDown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { MODULE_ICONS } from "../../_lib/role-helpers"
import type { ModuleConfig } from "@/types/role"

interface RoleModuleCardProps {
  moduleKey: string
  config: ModuleConfig
  modPermissions: Record<string, boolean>
  isSaving: boolean
  forceExpanded?: boolean
  onToggleAll: (moduleKey: string, actions: string[]) => void
  onTogglePermission: (moduleKey: string, actionKey: string, actions: string[]) => void
}

export const RoleModuleCard = React.memo(function RoleModuleCard({
  moduleKey,
  config,
  modPermissions,
  isSaving,
  forceExpanded = false,
  onToggleAll,
  onTogglePermission,
}: RoleModuleCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const Icon = MODULE_ICONS[moduleKey] || Sparkles
  const actionKeys = Object.keys(config.actions)
  const enabledCount = actionKeys.filter((a) => !!modPermissions[a]).length
  const allEnabled = actionKeys.length > 0 && enabledCount === actionKeys.length
  const isPartiallyEnabled = enabledCount > 0 && enabledCount < actionKeys.length

  const expanded = forceExpanded || isExpanded

  return (
    <Card className="rounded-xl border border-border shadow-2xs bg-card/40 overflow-hidden">
      <CardHeader
        onClick={() => setIsExpanded((prev) => !prev)}
        className="p-3 sm:p-3.5 flex flex-row items-center justify-between space-y-0 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-7 sm:size-8 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Icon className="size-3.5 sm:size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xs sm:text-sm font-bold tracking-tight truncate">
                {config.title}
              </CardTitle>
              {allEnabled && (
                <Badge variant="secondary" className="text-[10px] py-0 h-4.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 font-medium">
                  Semua Izin
                </Badge>
              )}
              {isPartiallyEnabled && (
                <Badge variant="outline" className="text-[10px] py-0 h-4.5 text-blue-600 dark:text-blue-400 border-blue-500/30 font-medium">
                  {enabledCount}/{actionKeys.length} Izin
                </Badge>
              )}
              {enabledCount === 0 && (
                <Badge variant="outline" className="text-[10px] py-0 h-4.5 text-muted-foreground font-normal">
                  Nonaktif
                </Badge>
              )}
            </div>
            <CardDescription className="text-[11px] truncate">
              {config.description}
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={allEnabled}
            onCheckedChange={() => onToggleAll(moduleKey, actionKeys)}
            disabled={isSaving}
            title={allEnabled ? "Nonaktifkan seluruh izin modul" : "Aktifkan seluruh izin modul"}
          />
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1 text-muted-foreground hover:text-foreground transition-transform"
            title={expanded ? "Tutup rincian aksi" : "Buka rincian aksi"}
          >
            <ChevronDown
              className={`size-4 transition-transform duration-150 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="p-2 sm:p-2.5 border-t border-border/40 divide-y divide-border/40 bg-card animate-in fade-in-50 duration-150">
          {Object.entries(config.actions).map(([actionKey, actionConfig]) => {
            const isChecked = !!modPermissions[actionKey]

            return (
              <div
                key={actionKey}
                className="flex items-center justify-between py-2 px-2 rounded-lg transition-colors hover:bg-muted/40 gap-3"
              >
                <div className="min-w-0 flex flex-col">
                  <span className="text-xs font-semibold text-foreground">
                    {actionConfig.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {actionConfig.description}
                  </span>
                </div>

                <Switch
                  checked={isChecked}
                  onCheckedChange={() =>
                    onTogglePermission(moduleKey, actionKey, actionKeys)
                  }
                  disabled={isSaving}
                />
              </div>
            )
          })}
        </CardContent>
      )}
    </Card>
  )
})
