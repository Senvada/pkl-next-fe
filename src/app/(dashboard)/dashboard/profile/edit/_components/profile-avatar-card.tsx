import * as React from "react"
import { Camera, Upload, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ImageCropperModal } from "@/components/shared/image-cropper-modal"
import { useUploadAvatar, useDeleteAvatar } from "@/hooks/modules/profile"
import type { UserProfile } from "@/types/profile"

interface ProfileAvatarCardProps {
  user: UserProfile | null | undefined
}

export function ProfileAvatarCard({ user }: ProfileAvatarCardProps) {
  const uploadAvatarMutation = useUploadAvatar()
  const deleteAvatarMutation = useDeleteAvatar()

  const [cropperOpen, setCropperOpen] = React.useState(false)
  const [selectedImageSrc, setSelectedImageSrc] = React.useState<string | null>(null)
  const [avatarNotice, setAvatarNotice] = React.useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setAvatarNotice({ type: "error", text: "Format file harus berupa gambar (JPG, PNG, WebP)." })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImageSrc(reader.result as string)
      setCropperOpen(true)
      setAvatarNotice(null)
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handleCropComplete = async ({ file }: { file: File }) => {
    try {
      setAvatarNotice(null)
      await uploadAvatarMutation.mutateAsync(file)
      setAvatarNotice({ type: "success", text: "Foto profil berhasil diperbarui ke Cloud Storage!" })
    } catch (err) {
      setAvatarNotice({ type: "error", text: err instanceof Error ? err.message : "Gagal mengunggah foto profil." })
    }
  }

  const handleDeleteAvatar = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto profil saat ini?")) return
    try {
      setAvatarNotice(null)
      await deleteAvatarMutation.mutateAsync()
      setAvatarNotice({ type: "success", text: "Foto profil berhasil dihapus." })
    } catch (err) {
      setAvatarNotice({ type: "error", text: err instanceof Error ? err.message : "Gagal menghapus foto profil." })
    }
  }

  const initials = user?.name
    ? user.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "U"

  return (
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
            {avatarNotice.type === "success" ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
            <span>{avatarNotice.text}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-1">
          <div className="relative group">
            <Avatar className="size-24 sm:size-28 rounded-2xl border-2 border-border shadow-md">
              {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.name} className="object-cover" />}
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

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />

      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        imageSrc={selectedImageSrc}
        aspectRatio={1}
        cropShape="round"
        title="Potong Foto Profil (1:1)"
        description="Posisikan dan potong foto wajah Anda ke dalam rasio lingkaran 1:1."
        outputFileName="avatar.webp"
        onCropComplete={handleCropComplete}
        isSubmitting={uploadAvatarMutation.isPending}
      />
    </Card>
  )
}
