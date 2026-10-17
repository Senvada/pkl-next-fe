import * as React from "react"
import { User as UserIcon, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import type { UserProfile } from "@/types/profile"

interface ProfileIdentityCardProps {
  user: UserProfile | null | undefined
}

export function ProfileIdentityCard({ user }: ProfileIdentityCardProps) {
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <UserIcon className="size-4 text-blue-600 dark:text-blue-400" />
          <span>Detail Akun &amp; Identitas</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Informasi data akun yang tersinkronisasi dalam sistem PKL.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/60 text-xs sm:text-sm">
          <span className="text-muted-foreground">Nama Lengkap</span>
          <span className="col-span-2 font-medium text-foreground">{user?.name || "-"}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/60 text-xs sm:text-sm">
          <span className="text-muted-foreground">Email Utama</span>
          <span className="col-span-2 font-medium text-foreground">{user?.email || "-"}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/60 text-xs sm:text-sm">
          <span className="text-muted-foreground">Hak Akses</span>
          <span className="col-span-2 font-medium text-foreground">{user?.role_name || "-"}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 text-xs sm:text-sm">
          <span className="text-muted-foreground">Status Akun</span>
          <span className="col-span-2 font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5" />
            <span>Aktif &amp; Terverifikasi</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
