"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { authStore } from "@/lib/auth/auth-store"
import { setCurrentUser, getCurrentUser } from "@/hooks/modules/auth/useCurrentUser"
import type {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
  AvatarPresignRequest,
  AvatarPresignResponse,
} from "@/types/profile"

export const PROFILE_QUERY_KEY = ["user", "me"]

/**
 * Hook to fetch the active user's profile from /user/me.
 */
export function useProfileQuery() {
  const token = authStore.getToken()

  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async (): Promise<UserProfile> => {
      const profile = await apiClient.get<UserProfile>("/user/me")
      setCurrentUser(profile)
      return profile
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to update active user profile details (e.g. name, avatar).
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
      return apiClient.patch<UserProfile>("/user/me", payload)
    },
    onSuccess: (updatedUser) => {
      setCurrentUser(updatedUser)
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedUser)
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })
}

/**
 * Hook to change user password with old password verification.
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload): Promise<{ message: string }> => {
      return apiClient.put<{ message: string }>("/user/me/password", payload)
    },
  })
}

/**
 * Direct client-to-storage avatar upload using S3 Presigned URL.
 * 1. Requests signed PUT URL from backend.
 * 2. Uploads binary file directly to S3/MinIO bucket (no server overhead).
 * 3. Patches user profile with permanent public URL.
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File): Promise<UserProfile> => {
      // 1. Get presigned upload URL from backend
      const presign = await apiClient.post<AvatarPresignResponse>(
        "/user/me/avatar/presign",
        {
          content_type: file.type || "image/webp",
          file_size: file.size,
        } as AvatarPresignRequest
      )

      // 2. Direct upload to S3/MinIO via PUT
      const uploadResponse = await fetch(presign.upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "image/webp",
        },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error(
          `Gagal mengunggah foto ke storage (${uploadResponse.status} ${uploadResponse.statusText})`
        )
      }

      // 3. Update profile avatar_url in backend
      const updatedUser = await apiClient.patch<UserProfile>("/user/me", {
        avatar_url: presign.public_url,
      })

      return updatedUser
    },
    onSuccess: (updatedUser) => {
      setCurrentUser(updatedUser)
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedUser)
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })
}

/**
 * Hook to delete active user's avatar.
 */
export function useDeleteAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.delete("/user/me/avatar")
    },
    onSuccess: () => {
      const currentUser = getCurrentUser()
      if (currentUser) {
        const updated = { ...currentUser, avatar_url: null }
        setCurrentUser(updated)
        queryClient.setQueryData(PROFILE_QUERY_KEY, updated)
      }
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })
}
