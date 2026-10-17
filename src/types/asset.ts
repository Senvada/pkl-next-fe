import type { PaginationMeta } from "./auth"

export interface Asset {
  id: string
  path: string
  url: string
  filename: string
  mime_type: string
  size: number
  created_by: string
  created_at: string
}

export interface AssetPresignRequest {
  filename: string
  content_type: string
  size?: number
  folder?: string
}

export interface AssetPresignResponse {
  upload_url: string
  public_url: string
  path: string
}

export interface CreateAssetPayload {
  path: string
  filename: string
  mime_type: string
  size: number
}

export interface AssetFilter {
  search?: string
  mime_type?: string
}

export interface UseAssetsQueryParams {
  page?: number
  limit?: number
  filter?: AssetFilter
  enabled?: boolean
}

export interface AssetsQueryResult {
  assets: Asset[]
  pagination?: PaginationMeta
}
