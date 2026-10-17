export interface Company {
  id: string
  name: string
  slug: string
  email?: string | null
  phone_number?: string | null
  address?: string | null
  description?: string | null
  image_url?: string | null
  gmaps_link?: string | null
  lat?: number | null
  lng?: number | null
  status: "active" | "inactive"
  member_count?: number
  created_at?: string
  updated_at?: string
}

export interface CreateCompanyPayload {
  name: string
  email?: string
  phone_number?: string
  address?: string
  description?: string
  image_url?: string
  gmaps_link?: string
  status?: "active" | "inactive"
}

export interface UpdateCompanyPayload {
  name?: string
  email?: string
  phone_number?: string
  address?: string
  description?: string
  image_url?: string
  gmaps_link?: string
  status?: "active" | "inactive"
}
