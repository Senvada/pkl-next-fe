import * as React from "react"
import { Shield, CheckCircle2, Mail, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { UserProfile } from "@/types/profile"

interface ProfileSummaryCardProps {
  user: UserProfile | null | undefined
}

export const ProfileSummaryCard = React.memo(function ProfileSummaryCard({ user }: ProfileSummaryCardProps) {
  const initials = user?.name
    ? user.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "U"

  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card/60">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative group">
            <Avatar className="size-24 sm:size-28 rounded-2xl border-2 border-border shadow-md">
              {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.name} className="object-cover rounded-2xl" />}
              <AvatarFallback className="rounded-2xl bg-blue-500/10 text-2xl font-bold text-blue-600 dark:text-blue-400">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {user?.name || "Pengguna"}
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                <Badge
                  variant="secondary"
                  className="rounded-lg px-2.5 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/40"
                >
                  <Shield className="size-3 text-blue-600 dark:text-blue-400" />
                  <span>{user?.role_name || "Pengguna"}</span>
                </Badge>

                {(user?.status === "active" || user?.status === "ACTIVE") && (
                  <Badge
                    variant="outline"
                    className="rounded-lg px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300/40 dark:border-emerald-800/40"
                  >
                    <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Aktif</span>
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs sm:text-sm text-muted-foreground pt-1">
              <span className="inline-flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="size-4 text-muted-foreground/70" />
                {user?.email}
              </span>

              {user?.created_at && (
                <span className="inline-flex items-center justify-center sm:justify-start gap-1.5">
                  <Calendar className="size-4 text-muted-foreground/70" />
                  Bergabung{" "}
                  {new Date(user.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
