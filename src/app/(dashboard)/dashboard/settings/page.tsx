"use client"

import * as React from "react"
import { useDashboardSettings } from "./_hooks/use-dashboard-settings"
import { SettingsHeader } from "./_components/settings-header"
import { SettingsNotice } from "./_components/settings-notice"
import { GeneralSettingsTab } from "./_components/tabs/general-settings-tab"
import { RulesSettingsTab } from "./_components/tabs/rules-settings-tab"
import { NotificationsSettingsTab } from "./_components/tabs/notifications-settings-tab"
import { SystemSettingsTab } from "./_components/tabs/system-settings-tab"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { School, ShieldCheck, Bell, Server } from "lucide-react"

export default function SettingsPage() {
  const {
    settings,
    isSaving,
    notice,
    setNotice,
    updateGeneral,
    updateRules,
    updateNotifications,
    saveSettings,
    resetSettings,
  } = useDashboardSettings()

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      <SettingsHeader
        isSaving={isSaving}
        onSave={saveSettings}
        onReset={resetSettings}
      />

      <SettingsNotice notice={notice} onClose={() => setNotice(null)} />

      <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList className="h-11 p-1 bg-muted/60 dark:bg-muted/30 border border-border/60 rounded-xl gap-1 w-full sm:w-auto overflow-x-auto justify-start">
          <TabsTrigger
            value="general"
            className="rounded-lg text-xs font-semibold gap-1.5 px-3 py-1.5 cursor-pointer"
          >
            <School className="size-3.5" />
            <span>Umum & Periode</span>
          </TabsTrigger>

          <TabsTrigger
            value="rules"
            className="rounded-lg text-xs font-semibold gap-1.5 px-3 py-1.5 cursor-pointer"
          >
            <ShieldCheck className="size-3.5" />
            <span>Aturan PKL</span>
          </TabsTrigger>

          <TabsTrigger
            value="notifications"
            className="rounded-lg text-xs font-semibold gap-1.5 px-3 py-1.5 cursor-pointer"
          >
            <Bell className="size-3.5" />
            <span>Notifikasi</span>
          </TabsTrigger>

          <TabsTrigger
            value="system"
            className="rounded-lg text-xs font-semibold gap-1.5 px-3 py-1.5 cursor-pointer"
          >
            <Server className="size-3.5" />
            <span>Sistem & Integrasi</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0">
          <GeneralSettingsTab data={settings.general} onChange={updateGeneral} />
        </TabsContent>

        <TabsContent value="rules" className="mt-0">
          <RulesSettingsTab data={settings.rules} onChange={updateRules} />
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <NotificationsSettingsTab
            data={settings.notifications}
            onChange={updateNotifications}
          />
        </TabsContent>

        <TabsContent value="system" className="mt-0">
          <SystemSettingsTab onClearCache={resetSettings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
