export interface AcademicPeriod {
  id: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AspectTemplateItem {
  id: string
  category?: string
  title: string
}

export interface AssessmentTemplate {
  id: string
  department_id: string
  department_name?: string
  department_code?: string
  period_id: string
  period_name?: string
  title: string
  work_aspects: AspectTemplateItem[]
  behavior_aspects: AspectTemplateItem[]
  created_at: string
  updated_at: string
}

export interface WorkAspectItem {
  id: string
  category?: string
  title: string
  is_custom: boolean
  score_numeric: number
  score_letter: string
  score_predicate: string
}

export interface BehaviorAspectItem {
  id: string
  title: string
  score_numeric: number
  score_letter: string
  score_predicate: string
}

export interface StudentAssessment {
  id: string
  student_id: string
  student_name: string
  student_email?: string
  student_nis?: string
  student_class?: string
  school_name: string
  school_address: string
  school_phone: string
  school_email: string
  department_id: string
  department_name: string
  department_code?: string
  period_id: string
  period_name?: string
  template_id?: string
  company_id?: string
  company_name: string
  company_address?: string
  supervisor_name: string
  supervisor_nip?: string
  assessment_city: string
  assessment_date?: string
  work_aspects: WorkAspectItem[]
  behavior_aspects: BehaviorAspectItem[]
  work_average: number
  behavior_average: number
  overall_average: number
  status: "draft" | "submitted" | "verified"
  created_at: string
  updated_at: string
}

export interface UpsertStudentAssessmentPayload {
  period_id?: string
  student_nis?: string
  student_class?: string
  company_id?: string
  company_name: string
  company_address?: string
  supervisor_name: string
  supervisor_nip?: string
  assessment_city?: string
  assessment_date?: string
  work_aspects: WorkAspectItem[]
  behavior_aspects: BehaviorAspectItem[]
  status?: "draft" | "submitted" | "verified"
}
