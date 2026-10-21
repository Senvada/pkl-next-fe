export interface GeneralSettings {
  schoolName: string
  schoolLevel: string
  hubinEmail: string
  hubinPhone: string
  schoolAddress: string
  academicYear: string
  periodTerm: string
  startDate: string
  endDate: string
  durationMonths: number
}

export interface RulesSettings {
  isOpenRegistration: boolean
  maxApplicationsPerStudent: number
  requireCvUpload: boolean
  requirePortfolio: boolean
  requireDailyLogbook: boolean
  logbookGracePeriodHours: number
  approvalType: "manual" | "auto"
}

export interface NotificationSettings {
  emailOnStatusChange: boolean
  emailToCompanyNewApplicant: boolean
  dailyLogbookReminder: boolean
  lowQuotaAlert: boolean
  weeklyReportSummary: boolean
}

export interface DashboardSettingsState {
  general: GeneralSettings
  rules: RulesSettings
  notifications: NotificationSettings
}
