export interface UserRole {
  id: string
  name: string
  color: string
}

export interface UserDepartment {
  id: string
  name: string
  code: string
  color: string
}

export interface UserCompany {
  id: string
  name: string
  slug: string
}

export interface UserItem {
  id: string
  name: string
  email: string
  avatar_url?: string | null
  image?: string | null
  status: "active" | "waiting" | "inactive" | "banned"
  role_id: string
  role_name: string
  role?: UserRole
  department_id?: string | null
  department_name?: string | null
  department?: UserDepartment
  company_id?: string | null
  company_name?: string | null
  company?: UserCompany
  parent_id?: string | null
  parent_name?: string | null
  sub_user_count: number
  google_bound: boolean
  created_at: string
  updated_at: string
}

export interface UserFilter {
  search?: string
  role_id?: string
  department_id?: string
  company_id?: string
  parent_id?: string
  status?: string
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role_id: string
  department_id?: string | null
  company_id?: string | null
  parent_id?: string | null
  status?: string
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  password?: string
  role_id?: string
  department_id?: string | null
  company_id?: string | null
  parent_id?: string | null
  status?: string
  avatar_url?: string | null
}
