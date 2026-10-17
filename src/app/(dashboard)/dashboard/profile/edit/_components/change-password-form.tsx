import * as React from "react"
import { KeyRound, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChangePassword } from "@/hooks/modules/profile"

export function ChangePasswordForm() {
  const changePasswordMutation = useChangePassword()
  const [oldPassword, setOldPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showOldPassword, setShowOldPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg(null)
    setErrorMsg(null)

    if (!oldPassword) return setErrorMsg("Kata sandi lama wajib diisi.")
    if (!newPassword) return setErrorMsg("Kata sandi baru wajib diisi.")
    if (newPassword.length < 8) return setErrorMsg("Kata sandi baru minimal 8 karakter.")
    if (newPassword !== confirmPassword) return setErrorMsg("Konfirmasi kata sandi baru tidak sesuai.")

    try {
      await changePasswordMutation.mutateAsync({
        old_password: oldPassword,
        new_password: newPassword,
      })
      setSuccessMsg("Kata sandi berhasil diperbarui!")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memperbarui kata sandi.")
    }
  }

  return (
    <Card id="security" className="rounded-2xl border border-border shadow-xs bg-card/60 scroll-mt-20">
      <form onSubmit={handleSubmit}>
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

          <div className="space-y-3 max-w-lg">
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
                  {showOldPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

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
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

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
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
  )
}
