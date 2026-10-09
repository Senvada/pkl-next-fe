"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Camera,
  Trash2,
  User as UserIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  KeyRound,
  Upload,
} from "lucide-react"

import {
  useProfileQuery,
  useUpdateProfile,
  useChangePassword,
  useUploadAvatar,
  useDeleteAvatar,
} from "@/hooks/modules/profile"
import { useCurrentUser } from "@/hooks/modules/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ImageCropperModal } from "@/components/shared/image-cropper-modal"

export default function EditProfilePage() {
  const { data: profile, isLoading } = useProfileQuery()
  const cachedUser = useCurrentUser()
  const user = profile || cachedUser

  // Mutation hooks
  const updateProfileMutation = useUpdateProfile()
  const changePasswordMutation = useChangePassword()
  const uploadAvatarMutation = useUploadAvatar()
  const deleteAvatarMutation = useDeleteAvatar()

  // Profile Form state
  const [customName, setCustomName] = React.useState<string | null>(null)
  const name = customName ?? (user?.name || "")
  const [profileSuccessMsg, setProfileSuccessMsg] = React.useState<string | null>(null)
  const [profileErrorMsg, setProfileErrorMsg] = React.useState<string | null>(null)

  // Password Form state
  const [oldPassword, setOldPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showOldPassword, setShowOldPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [passwordSuccessMsg, setPasswordSuccessMsg] = React.useState<string | null>(null)
  const [passwordErrorMsg, setPasswordErrorMsg] = React.useState<string | null>(null)

  // Avatar Crop Modal state
  const [cropperOpen, setCropperOpen] = React.useState(false)
  const [selectedImageSrc, setSelectedImageSrc] = React.useState<string | null>(null)
  const [avatarNotice, setAvatarNotice] = React.useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // File selection for avatar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate type
    if (!file.type.startsWith("image/")) {
      setAvatarNotice({
        type: "error",
        text: "Format file harus berupa gambar (JPG, PNG, WebP).",
      })
      return
    }

    // Read to data URL for cropper
    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImageSrc(reader.result as string)
      setCropperOpen(true)
      setAvatarNotice(null)
    }
    reader.readAsDataURL(file)

    // Reset input so same file can be selected again
    e.target.value = ""
  }

  // Handle crop completion & direct S3 upload
  const handleCropComplete = async ({ file }: { file: File }) => {
    try {
      setAvatarNotice(null)
      await uploadAvatarMutation.mutateAsync(file)
      setAvatarNotice({
        type: "success",
        text: "Foto profil berhasil diperbarui ke Cloud Storage!",
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah foto profil."
      setAvatarNotice({
        type: "error",
        text: msg,
      })
    }
  }

  // Handle avatar removal
  const handleDeleteAvatar = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto profil saat ini?")) return
    try {
      setAvatarNotice(null)
      await deleteAvatarMutation.mutateAsync()
      setAvatarNotice({
        type: "success",
        text: "Foto profil berhasil dihapus.",
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus foto profil."
      setAvatarNotice({
        type: "error",
        text: msg,
      })
    }
  }

  // Handle profile form submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSuccessMsg(null)
    setProfileErrorMsg(null)

    if (!name.trim()) {
      setProfileErrorMsg("Nama lengkap tidak boleh kosong.")
      return
    }

    try {
      await updateProfileMutation.mutateAsync({ name: name.trim() })
      setProfileSuccessMsg("Profil berhasil diperbarui!")
      setCustomName(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui profil."
      setProfileErrorMsg(msg)
    }
  }

  // Handle password form submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSuccessMsg(null)
    setPasswordErrorMsg(null)

    if (!oldPassword) {
      setPasswordErrorMsg("Kata sandi lama wajib diisi.")
      return
    }

    if (!newPassword) {
      setPasswordErrorMsg("Kata sandi baru wajib diisi.")
      return
    }

    if (newPassword.length < 8) {
      setPasswordErrorMsg("Kata sandi baru minimal 8 karakter.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg("Konfirmasi kata sandi baru tidak sesuai.")
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        old_password: oldPassword,
        new_password: newPassword,
      })
      setPasswordSuccessMsg("Kata sandi berhasil diperbarui!")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui kata sandi."
      setPasswordErrorMsg(msg)
    }
  }

  if (isLoading && !user) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
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
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Navigation & Header */}
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl cursor-pointer gap-1.5 text-xs h-9 px-3"
        >
          <Link href="/dashboard/profile">
            <ArrowLeft className="size-4" />
            <span>Kembali ke Profil</span>
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Edit Profil Pengguna
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Perbarui foto profil dengan cropper 1:1, ubah nama lengkap, dan amankan akun Anda.
        </p>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />

      {/* Section 1: Avatar / Profile Photo with 1:1 Cropper */}
      <Card className="rounded-2xl border border-border shadow-xs bg-card/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Camera className="size-4 text-blue-600 dark:text-blue-400" />
            <span>Foto Profil Pengguna</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Format rasio 1:1 (persegi). Foto dipotong di browser dan diunggah langsung ke Cloud Storage via S3 Presigned URL.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {avatarNotice && (
            <div
              className={`flex items-center gap-2 p-3 text-xs rounded-xl border ${
                avatarNotice.type === "success"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              {avatarNotice.type === "success" ? (
                <CheckCircle2 className="size-4 shrink-0" />
              ) : (
                <AlertCircle className="size-4 shrink-0" />
              )}
              <span>{avatarNotice.text}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-1">
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

              {uploadAvatarMutation.isPending && (
                <div className="absolute inset-0 bg-background/80 rounded-2xl flex flex-col items-center justify-center gap-1 backdrop-blur-xs">
                  <Loader2 className="size-6 animate-spin text-blue-600" />
                  <span className="text-[10px] font-medium text-muted-foreground">Mengunggah...</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2.5 text-center sm:text-left">
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadAvatarMutation.isPending || deleteAvatarMutation.isPending}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-9"
                >
                  <Upload className="size-3.5" />
                  <span>Pilih &amp; Potong Foto Baru</span>
                </Button>

                {user?.avatar_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteAvatar}
                    disabled={uploadAvatarMutation.isPending || deleteAvatarMutation.isPending}
                    className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer gap-1.5 text-xs h-9"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Hapus Foto</span>
                  </Button>
                )}
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Mendukung gambar JPG, PNG, atau WebP. Foto akan dipotong secara presisi menggunakan Cropper 1:1 sebelum disimpan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Personal Information Form */}
      <Card className="rounded-2xl border border-border shadow-xs bg-card/60">
        <form onSubmit={handleProfileSubmit}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <UserIcon className="size-4 text-blue-600 dark:text-blue-400" />
              <span>Informasi Pribadi</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Ubah nama lengkap dan tinjau data identitas akun Anda.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {profileSuccessMsg && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            {profileErrorMsg && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
                <AlertCircle className="size-4 shrink-0" />
                <span>{profileErrorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                  className="rounded-xl h-9 text-xs"
                />
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Alamat Email</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Tidak dapat diubah</span>
                </label>
                <Input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="rounded-xl h-9 text-xs bg-muted/50 cursor-not-allowed opacity-80"
                />
              </div>

              {/* Role (Readonly) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Hak Akses / Peran</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Dikelola oleh Administrator</span>
                </label>
                <Input
                  type="text"
                  value={user?.role_name || ""}
                  disabled
                  className="rounded-xl h-9 text-xs bg-muted/50 cursor-not-allowed opacity-80"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/70 pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-9 px-4"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>Simpan Perubahan Data</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Section 3: Change Password Form */}
      <Card id="security" className="rounded-2xl border border-border shadow-xs bg-card/60 scroll-mt-20">
        <form onSubmit={handlePasswordSubmit}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <KeyRound className="size-4 text-blue-600 dark:text-blue-400" />
              <span>Keamanan Kata Sandi</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Perbarui kata sandi akun secara berkala untuk menjaga kerahasiaan data Anda.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {passwordSuccessMsg && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{passwordSuccessMsg}</span>
              </div>
            )}

            {passwordErrorMsg && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
                <AlertCircle className="size-4 shrink-0" />
                <span>{passwordErrorMsg}</span>
              </div>
            )}

            <div className="space-y-3 max-w-lg">
              {/* Old Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kata Sandi Saat Ini <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Masukkan kata sandi lama Anda"
                    required
                    className="rounded-xl h-9 text-xs pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showOldPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kata Sandi Baru <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    required
                    className="rounded-xl h-9 text-xs pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Konfirmasi Kata Sandi Baru <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    required
                    className="rounded-xl h-9 text-xs pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/70 pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs gap-1.5 text-xs h-9 px-4"
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Memperbarui...</span>
                </>
              ) : (
                <>
                  <KeyRound className="size-3.5" />
                  <span>Perbarui Kata Sandi</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Reusable Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        imageSrc={selectedImageSrc}
        aspectRatio={1} // Explicitly 1:1 for profile picture as requested
        cropShape="round"
        title="Potong Foto Profil (1:1)"
        description="Posisikan dan potong foto wajah Anda ke dalam rasio lingkaran 1:1."
        outputFileName="avatar.webp"
        onCropComplete={handleCropComplete}
        isSubmitting={uploadAvatarMutation.isPending}
      />
    </div>
  )
}
