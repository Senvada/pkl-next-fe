import * as React from "react"
import Link from "next/link"
import { KeyRound } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { UserProfile } from "@/types/profile"

interface ProfileSecurityCardProps {
  user: UserProfile | null | undefined
}

export const ProfileSecurityCard = React.memo(function ProfileSecurityCard({ user }: ProfileSecurityCardProps) {
  return (
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
              Kata sandi terlindungi dengan enkripsi aman.
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
  )
})
