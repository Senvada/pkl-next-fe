export interface Department {
  id: string
  name: string
  code: string
  color: string
  user_count?: number
  created_at?: string
  updated_at?: string
}

export interface CreateDepartmentPayload {
  name: string
  code: string
  color?: string
}

export interface UpdateDepartmentPayload {
  name?: string
  code?: string
  color?: string
}
