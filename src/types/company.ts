export interface CompanyDepartmentItem {
  id: string
  name: string
  code: string
  color: string
}

export interface Company {
  id: string
  name: string
  slug: string
  email?: string | null
  phone_number?: string | null
  address?: string | null
  description?: string | null
  content?: unknown
  image_url?: string | null
  gmaps_link?: string | null
  lat?: number | null
  lng?: number | null
  status: "active" | "inactive"
  member_count?: number
  departments?: CompanyDepartmentItem[]
  created_by?: string | null
  updated_by?: string | null
  created_at?: string
  updated_at?: string
}

export interface CreateCompanyPayload {
  name: string
  email?: string | null
  phone_number?: string | null
  address?: string | null
  description?: string | null
  content?: unknown
  image_url?: string | null
  gmaps_link?: string | null
  lat?: number | null
  lng?: number | null
  status?: "active" | "inactive"
  department_ids?: string[]
}

export interface UpdateCompanyPayload {
  name?: string
  email?: string | null
  phone_number?: string | null
  address?: string | null
  description?: string | null
  content?: unknown
  image_url?: string | null
  gmaps_link?: string | null
  lat?: number | null
  lng?: number | null
  status?: "active" | "inactive"
  department_ids?: string[]
}

export interface CompanyFilter {
  search?: string
  department_id?: string
  status?: string
}

export interface CompanyMapItem {
  id: string
  name: string
  slug: string
  address?: string | null
  image_url?: string | null
  lat: number
  lng: number
  departments: CompanyDepartmentItem[]
}

export interface PresignCompanyImagePayload {
  company_id?: string
  content_type: string
  file_size: number
}

export interface PresignCompanyImageResponse {
  upload_url: string
  public_url: string
  key: string
}

export interface ResolveMapsPayload {
  url: string
}

export interface ResolveMapsResponse {
  lat: number
  lng: number
}

