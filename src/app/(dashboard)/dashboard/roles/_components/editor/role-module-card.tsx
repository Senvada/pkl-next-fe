import * as React from "react"
import { Sparkles } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { MODULE_ICONS } from "../../_lib/role-helpers"
import type { ModuleConfig } from "@/types/role"

interface RoleModuleCardProps {
  moduleKey: string
  config: ModuleConfig
  modPermissions: Record<string, boolean>
  isSaving: boolean
  onToggleAll: (moduleKey: string, actions: string[]) => void
  onTogglePermission: (moduleKey: string, actionKey: string, actions: string[]) => void
}

export const RoleModuleCard = React.memo(function RoleModuleCard({
  moduleKey,
  config,
  modPermissions,
  isSaving,
  onToggleAll,
  onTogglePermission,
}: RoleModuleCardProps) {
  const Icon = MODULE_ICONS[moduleKey] || Sparkles
  const actionKeys = Object.keys(config.actions)
  const allEnabled = actionKeys.every((a) => !!modPermissions[a])

  return (
    <Card className="rounded-xl border border-border shadow-2xs bg-card/40 overflow-hidden">
      <CardHeader className="p-3 sm:p-3.5 pb-2.5 flex flex-row items-center justify-between space-y-0 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-2.5">
          <div className="size-7 sm:size-8 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Icon className="size-3.5 sm:size-4" />
          </div>
          <div>
            <CardTitle className="text-xs sm:text-sm font-bold tracking-tight">
              {config.title}
            </CardTitle>
            <CardDescription className="text-[11px] line-clamp-1">
              {config.description}
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
            {allEnabled ? "Matikan Modul" : "Aktifkan Modul"}
          </span>
          <Switch
            checked={allEnabled}
            onCheckedChange={() => onToggleAll(moduleKey, actionKeys)}
            disabled={isSaving}
            title={allEnabled ? "Nonaktifkan seluruh izin modul" : "Aktifkan seluruh izin modul"}
          />
        </div>
      </CardHeader>

      <CardContent className="p-2 sm:p-2.5 divide-y divide-border/40">
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
    </Card>
  )
})
