"use client"

import * as React from "react"
import { useProfileQuery } from "@/hooks/modules/profile"
import { useCurrentUser } from "@/hooks/modules/auth"
import { Skeleton } from "@/components/ui/skeleton"
import { EditProfileHeader } from "./_components/edit-profile-header"
import { ProfileAvatarCard } from "./_components/profile-avatar-card"
import { ProfileInfoForm } from "./_components/profile-info-form"
import { ChangePasswordForm } from "./_components/change-password-form"

const emptySubscribe = () => () => {}

export default function EditProfilePage() {
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false)
  const { data: profile, isLoading } = useProfileQuery()
  const cachedUser = useCurrentUser()
  const user = profile || (mounted ? cachedUser : null)

  if (!mounted || (isLoading && !user)) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <EditProfileHeader />
      <ProfileAvatarCard user={user} />
      <ProfileInfoForm user={user} />
      <ChangePasswordForm />
    </div>
  )
}
