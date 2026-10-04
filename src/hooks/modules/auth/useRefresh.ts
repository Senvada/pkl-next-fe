"use client"

import { useMutation } from "@tanstack/react-query"
import { refreshAccessToken } from "@/lib/api/client"

export function useRefresh() {
  return useMutation({
    mutationFn: async () => {
      const token = await refreshAccessToken()
      if (!token) {
        throw new Error("Gagal memperbarui sesi login.")
      }
      return token
    },
  })
}
