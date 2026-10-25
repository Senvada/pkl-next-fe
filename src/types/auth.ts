export interface DepartmentSummary {
  id: string;
  name: string;
  code: string;
  color?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  status: string;
  role_id: string;
  role_name: string;
  department_id?: string | null;
  department_ids?: string[];
  departments?: DepartmentSummary[];
  permissions?: Record<string, Record<string, boolean>>;
  company_id?: string | null;
  google_bound: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total_rows: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
  meta: {
    request_id: string;
    timestamp: string;
    pagination?: PaginationMeta;
  };
}
