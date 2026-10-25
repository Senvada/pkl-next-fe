import type { Metadata } from "next"
import { LogoutClient } from "./_components/logout-client"

export const metadata: Metadata = {
  title: "Keluar dari Akun | Portal PKL SMKN 6 Malang",
  description: "Keluar dari sesi portal digital Praktik Kerja Lapangan SMKN 6 Malang.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function LogoutPage() {
  return (
    <div className="w-full max-w-lg mx-auto my-auto py-12 px-4 flex flex-col items-center justify-center">
      <LogoutClient />
      <noscript>
        <meta httpEquiv="refresh" content="1;url=/login" />
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Jika browser tidak mengarahkan otomatis, silakan menuju{" "}
          <a href="/login" className="text-primary underline font-medium">
            Halaman Masuk
          </a>
          .
        </p>
      </noscript>
    </div>
  )
}
