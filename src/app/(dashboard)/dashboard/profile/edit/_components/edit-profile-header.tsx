import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EditProfileHeader() {
  return (
    <div className="space-y-4">
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
    </div>
  )
}
