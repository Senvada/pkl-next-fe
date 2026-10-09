"use client"

import Link from "next/link"
import {
  User as UserIcon,
  Mail,
  Shield,
  KeyRound,
  Pencil,
  CheckCircle2,
  Calendar,
  Cloud,
} from "lucide-react"

import { useProfileQuery } from "@/hooks/modules/profile"
import { useCurrentUser } from "@/hooks/modules/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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

  const initials = user?.name
    ? user.name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : "U"

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header section */}
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

      {/* Main Profile Summary Card */}
      <Card className="rounded-2xl border border-border shadow-xs bg-card/60 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="size-24 sm:size-28 rounded-2xl border-2 border-border shadow-md">
                {user?.avatar_url ? (
                  <AvatarImage
                    src={user.avatar_url}
                    alt={user.name}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="rounded-2xl bg-blue-500/10 text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
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

                  {user?.status === "active" || user?.status === "ACTIVE" ? (
                    <Badge
                      variant="outline"
                      className="rounded-lg px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300/40 dark:border-emerald-800/40"
                    >
                      <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Aktif</span>
                    </Badge>
                  ) : null}
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
                    Bergabung {new Date(user.created_at).toLocaleDateString("id-ID", {
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

      {/* Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identity & Basic Info Card */}
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
              <span className="col-span-2 font-medium text-foreground">
                {user?.name || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/60 text-xs sm:text-sm">
              <span className="text-muted-foreground">Email Utama</span>
              <span className="col-span-2 font-medium text-foreground">
                {user?.email || "-"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/60 text-xs sm:text-sm">
              <span className="text-muted-foreground">Hak Akses</span>
              <span className="col-span-2 font-medium text-foreground">
                {user?.role_name || "-"}
              </span>
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

        {/* Security & Cloud Card */}
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
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs cursor-pointer"
                >
                  <Link href="/dashboard/profile/edit#security">
                    Ubah Sandi
                  </Link>
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
                <Badge
                  variant={user?.google_bound ? "default" : "outline"}
                  className="rounded-lg text-xs"
                >
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
                <p className="font-semibold text-foreground">
                  Integrasi Cloud Storage Mandiri
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Foto profil diunggah langsung (Client-to-Storage) menggunakan S3 Presigned URL untuk efisiensi transfer data maksimal tanpa membebani server.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
