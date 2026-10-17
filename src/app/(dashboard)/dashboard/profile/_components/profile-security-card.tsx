import * as React from "react"
import Link from "next/link"
import { KeyRound, Cloud } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { UserProfile } from "@/types/profile"

interface ProfileSecurityCardProps {
  user: UserProfile | null | undefined
}

export const ProfileSecurityCard = React.memo(function ProfileSecurityCard({ user }: ProfileSecurityCardProps) {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-border shadow-xs bg-card/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <KeyRound className="size-4 text-blue-600 dark:text-blue-400" />
            <span>Keamanan Akun</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Kredensial login dan opsi pemulihan keamanan sandi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-1">
          <div className="flex items-center justify-between py-2 border-b border-border/60 text-xs sm:text-sm">
            <div>
              <div className="font-medium text-foreground">Kata Sandi Akun</div>
              <div className="text-xs text-muted-foreground">
                Terenkripsi dengan standar Bcrypt aman.
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-lg text-xs cursor-pointer">
              <Link href="/dashboard/profile/edit#security">Ubah Sandi</Link>
            </Button>
          </div>

          <div className="flex items-center justify-between py-2 text-xs sm:text-sm">
            <div>
              <div className="font-medium text-foreground">Tautan Google</div>
              <div className="text-xs text-muted-foreground">
                {user?.google_bound
                  ? "Akun Google terhubung untuk login cepat."
                  : "Belum ditautkan dengan akun Google."}
              </div>
            </div>
            <Badge variant={user?.google_bound ? "default" : "outline"} className="rounded-lg text-xs">
              {user?.google_bound ? "Terhubung" : "Belum Terhubung"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border shadow-xs bg-blue-500/5 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-900/30">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Cloud className="size-5" />
          </div>
          <div className="text-xs space-y-1">
            <p className="font-semibold text-foreground">Integrasi Cloud Storage Mandiri</p>
            <p className="text-muted-foreground leading-relaxed">
              Foto profil diunggah langsung (Client-to-Storage) menggunakan S3 Presigned URL untuk efisiensi transfer data maksimal tanpa membebani server.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})
