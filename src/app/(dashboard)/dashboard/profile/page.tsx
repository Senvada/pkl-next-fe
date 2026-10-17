"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"
import { useProfileQuery } from "@/hooks/modules/profile"
import { useCurrentUser } from "@/hooks/modules/auth"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfileSummaryCard } from "./_components/profile-summary-card"
import { ProfileIdentityCard } from "./_components/profile-identity-card"
import { ProfileSecurityCard } from "./_components/profile-security-card"

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfileQuery()
  const cachedUser = useCurrentUser()
  const user = profile || cachedUser

  if (isLoading && !user) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Profil Akun
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Informasi identitas akun, hak akses peran, serta konfigurasi keamanan pengguna.
          </p>
        </div>

        <Button
          asChild
          className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-sm w-fit"
        >
          <Link href="/dashboard/profile/edit">
            <Pencil className="size-4" />
            <span>Edit Profil</span>
          </Link>
        </Button>
      </div>

      <ProfileSummaryCard user={user} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileIdentityCard user={user} />
        <ProfileSecurityCard user={user} />
      </div>
    </div>
  )
}
