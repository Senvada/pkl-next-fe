import * as React from "react"
import { User as UserIcon, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUpdateProfile } from "@/hooks/modules/profile"
import type { UserProfile } from "@/types/profile"

interface ProfileInfoFormProps {
  user: UserProfile | null | undefined
}

export function ProfileInfoForm({ user }: ProfileInfoFormProps) {
  const updateProfileMutation = useUpdateProfile()
  const [customName, setCustomName] = React.useState<string | null>(null)
  const name = customName ?? (user?.name || "")
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg(null)
    setErrorMsg(null)

    if (!name.trim()) {
      setErrorMsg("Nama lengkap tidak boleh kosong.")
      return
    }

    try {
      await updateProfileMutation.mutateAsync({ name: name.trim() })
      setSuccessMsg("Profil berhasil diperbarui!")
      setCustomName(null)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memperbarui profil.")
    }
  }

  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card/60">
      <form onSubmit={handleSubmit}>
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
          {successMsg && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
  )
}
