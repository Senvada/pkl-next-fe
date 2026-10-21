"use client"

import * as React from "react"
import type { DashboardSettingsState } from "@/types/settings"
import type { PageNotice } from "../_components/settings-notice"

export const DEFAULT_SETTINGS: DashboardSettingsState = {
  general: {
    schoolName: "SMK Negeri 6 Kota Malang",
    schoolLevel: "SMK Pusat Keunggulan (Center of Excellence)",
    hubinEmail: "hubin@smkn6malang.sch.id",
    hubinPhone: "+62 812-3456-7890",
    schoolAddress: "Jl. Ki Ageng Gribig No. 28, Madyopuro, Kedungkandang, Kota Malang",
    academicYear: "2025/2026",
    periodTerm: "Semester Ganjil (Gelombang 1)",
    startDate: "2026-07-01",
    endDate: "2026-12-31",
    durationMonths: 6,
  },
  rules: {
    isOpenRegistration: true,
    maxApplicationsPerStudent: 3,
    requireCvUpload: true,
    requirePortfolio: false,
    requireDailyLogbook: true,
    logbookGracePeriodHours: 24,
    approvalType: "manual",
  },
  notifications: {
    emailOnStatusChange: true,
    emailToCompanyNewApplicant: true,
    dailyLogbookReminder: true,
    lowQuotaAlert: true,
    weeklyReportSummary: true,
  },
}

const SETTINGS_STORAGE_KEY = "pkl_dashboard_settings"

export function useDashboardSettings() {
  const [settings, setSettings] = React.useState<DashboardSettingsState>(DEFAULT_SETTINGS)
  const [isSaving, setIsSaving] = React.useState(false)
  const [notice, setNotice] = React.useState<PageNotice | null>(null)

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        queueMicrotask(() => {
          setSettings(parsed)
        })
      }
    } catch {
      // Fallback to default
    }
  }, [])

  const updateGeneral = React.useCallback(
    (patch: Partial<DashboardSettingsState["general"]>) => {
      setSettings((prev) => ({ ...prev, general: { ...prev.general, ...patch } }))
    },
    []
  )

  const updateRules = React.useCallback(
    (patch: Partial<DashboardSettingsState["rules"]>) => {
      setSettings((prev) => ({ ...prev, rules: { ...prev.rules, ...patch } }))
    },
    []
  )

  const updateNotifications = React.useCallback(
    (patch: Partial<DashboardSettingsState["notifications"]>) => {
      setSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, ...patch } }))
    },
    []
  )

  const saveSettings = React.useCallback(async () => {
    setIsSaving(true)
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
      await new Promise((r) => setTimeout(r, 400))
      setNotice({ type: "success", text: "Konfigurasi pengaturan dashboard berhasil disimpan." })
    } catch {
      setNotice({ type: "error", text: "Gagal menyimpan konfigurasi pengaturan." })
    } finally {
      setIsSaving(false)
    }
  }, [settings])

  const resetSettings = React.useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem(SETTINGS_STORAGE_KEY)
    setNotice({ type: "success", text: "Pengaturan telah dikembalikan ke nilai default." })
  }, [])

  return {
    settings,
    isSaving,
    notice,
    setNotice,
    updateGeneral,
    updateRules,
    updateNotifications,
    saveSettings,
    resetSettings,
  }
}
