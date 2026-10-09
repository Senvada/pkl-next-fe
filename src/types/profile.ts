import type { User } from "./auth"

export interface UpdateProfilePayload {
  name?: string
  avatar_url?: string
}

export interface ChangePasswordPayload {
  old_password: string
  new_password: string
}

export interface AvatarPresignRequest {
  content_type: string
  file_size: number
}

export interface AvatarPresignResponse {
  upload_url: string
  public_url: string
  key: string
  expires_at: string
}

export type UserProfile = User
