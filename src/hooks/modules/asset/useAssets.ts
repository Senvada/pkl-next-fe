"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { authStore } from "@/lib/auth/auth-store"
import type {
  Asset,
  AssetPresignRequest,
  AssetPresignResponse,
  CreateAssetPayload,
  UseAssetsQueryParams,
  AssetsQueryResult,
} from "@/types/asset"

export const ASSETS_QUERY_KEY = ["assets"]

export function useAssetsPaginatedQuery({
  page = 1,
  limit = 20,
  filter = {},
  enabled,
}: UseAssetsQueryParams = {}) {
  const token = authStore.getToken()
  const isEnabled = enabled !== undefined ? enabled : !!token

  return useQuery({
    queryKey: [...ASSETS_QUERY_KEY, page, limit, filter],
    queryFn: async (): Promise<AssetsQueryResult> => {
      const queryParams = new URLSearchParams()
      queryParams.set("page", String(page))
      queryParams.set("limit", String(limit))

      if (filter.search?.trim()) {
        queryParams.set("search", filter.search.trim())
      }
      if (filter.mime_type?.trim()) {
        queryParams.set("mime_type", filter.mime_type.trim())
      }

      const res = await apiClient.getPaginated<Asset>(`/assets?${queryParams.toString()}`)

      return {
        assets: Array.isArray(res.data) ? res.data : [],
        pagination: res.meta?.pagination,
      }
    },
    enabled: isEnabled,
    staleTime: 60 * 1000,
  })
}

export interface UploadAssetParams {
  file: File
  folder?: string
}

export function useUploadAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file, folder = "assets" }: UploadAssetParams): Promise<Asset> => {
      // 1. Dapatkan presigned PUT URL dari backend
      const presign = await apiClient.post<AssetPresignResponse>("/assets/presign", {
        filename: file.name,
        content_type: file.type || "image/webp",
        size: file.size,
        folder,
      } as AssetPresignRequest)

      // 2. Unggah file binary langsung ke S3 / Storage via PUT
      const uploadResponse = await fetch(presign.upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "image/webp",
        },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error(
          `Gagal mengunggah file ke storage (${uploadResponse.status} ${uploadResponse.statusText})`
        )
      }

      // 3. Daftarkan metadata aset ke database backend
      const createdAsset = await apiClient.post<Asset>("/assets", {
        path: presign.path,
        filename: file.name,
        mime_type: file.type || "image/webp",
        size: file.size,
      } as CreateAssetPayload)

      return createdAsset
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY })
    },
  })
}

export function useDeleteAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (assetId: string): Promise<void> => {
      await apiClient.delete(`/assets/${assetId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY })
    },
  })
}
