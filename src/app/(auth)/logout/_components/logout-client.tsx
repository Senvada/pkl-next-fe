"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { LogOut, Loader2, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api/client"
import { authStore } from "@/lib/auth/auth-store"
import { clearCurrentUser } from "@/hooks/modules/auth/useCurrentUser"
import { clearServerSessionAction } from "../actions"

export function LogoutClient() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isDone, setIsDone] = React.useState(false)
  const hasTriggered = React.useRef(false)

  React.useEffect(() => {
    if (hasTriggered.current) return
    hasTriggered.current = true

    let isMounted = true

    async function performLogout() {
      try {
        await apiClient.post("/auth/logout").catch(() => {})
      } finally {
        await clearServerSessionAction().catch(() => {})
        authStore.clearToken()
        clearCurrentUser()
        queryClient.clear()

        if (isMounted) {
          setIsDone(true)
        }

        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.replace("/login?logout=success")
          } else {
            router.replace("/login?logout=success")
          }
        }, 500)
      }
    }

    void performLogout()

    return () => {
      isMounted = false
    }
  }, [router, queryClient])

  return (
    <Card className="w-full max-w-md mx-auto border-border/80 bg-card/80 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
      <CardContent className="p-8 text-center flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center size-16 rounded-2xl bg-destructive/10 text-destructive">
          {isDone ? (
            <CheckCircle2 className="size-8 text-emerald-500 animate-in zoom-in-75 duration-200" />
          ) : (
            <>
              <LogOut className="size-8" />
              <div className="absolute inset-0 rounded-2xl border-2 border-destructive/30 animate-ping opacity-25" />
            </>
          )}
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-foreground">
            {isDone ? "Sesi Berakhir" : "Sedang Keluar dari Akun"}
          </h2>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            {isDone
              ? "Sesi Anda telah dibersihkan secara aman. Mengarahkan ke halaman masuk..."
              : "Mohon tunggu, sistem sedang membersihkan sesi dan data login Anda..."}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
          {!isDone && <Loader2 className="size-4 animate-spin text-primary" />}
          <span>{isDone ? "Mengarahkan..." : "Menghapus cookie & token..."}</span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.replace("/login")
            } else {
              router.replace("/login")
            }
          }}
          className="mt-2 text-xs rounded-xl cursor-pointer"
        >
          Klik di sini jika tidak diarahkan otomatis
        </Button>
      </CardContent>
    </Card>
  )
}
