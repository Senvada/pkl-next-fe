import * as React from "react"
import Image from "next/image"
import Logo from "@/assets/icon/Logo(150x150).svg"

export function LoginHeader() {
  return (
    <>
      {/* Mobile Branding Header */}
      <div className="flex flex-col items-center text-center lg:hidden mb-6">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 p-2 border border-blue-500/20 mb-3">
          <Image
            src={Logo}
            alt="Logo PKL SMKN 6 Malang"
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          PKL SMKN 6 Malang
        </span>
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-2 mb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Hai,{" "}
          <span className="bg-linear-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-sky-300">
            Selamat Datang!
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Masukkan email dan kata sandi akun Anda untuk mengakses portal PKL.
        </p>
      </div>
    </>
  )
}
