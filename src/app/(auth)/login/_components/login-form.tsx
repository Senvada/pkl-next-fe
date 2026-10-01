"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/assets/icon/Logo(150x150).svg";
import type { LoginFormData } from "@/types/auth";

type LoginFormProps = {
  onSubmit?: (data: LoginFormData) => Promise<void> | void;
  onGoogleLogin?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  onClearError?: () => void;
};

export default function LoginForm({
  onSubmit,
  onGoogleLogin,
  isLoading: externalLoading = false,
  errorMessage: externalError = null,
  onClearError,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const isLoading = externalLoading || internalLoading;
  const currentError = externalError || internalError;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalError(null);
    if (onClearError) onClearError();

    if (!email) {
      setInternalError("Silakan masukkan alamat email Anda.");
      return;
    }
    if (!isEmailValid) {
      setInternalError("Format alamat email tidak valid.");
      return;
    }
    if (!password) {
      setInternalError("Silakan masukkan kata sandi akun Anda.");
      return;
    }

    if (onSubmit) {
      await onSubmit({ email, password, remember });
    } else {
      // Default handler sementara sebelum integrasi TanStack Query
      setInternalLoading(true);
      setTimeout(() => {
        setInternalLoading(false);
        setInternalError(
          "Fitur pemanggilan API sedang disiapkan dengan TanStack Query."
        );
      }, 800);
    }
  };

  const handleGoogleClick = () => {
    if (onGoogleLogin) {
      onGoogleLogin();
    } else {
      setInternalError(
        "Login Google hanya berlaku untuk akun yang telah ditautkan di profil. Integrasi TanStack Query akan segera diaktifkan."
      );
    }
  };

  const clearCurrentError = () => {
    setInternalError(null);
    if (onClearError) onClearError();
  };

  return (
    <div className="relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/95 p-6 sm:p-9 xl:p-10 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#16212D]/95 dark:shadow-2xl">
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

      {/* Error Alert Banner */}
      {currentError && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:border-rose-500/20 dark:bg-rose-950/30 dark:text-rose-300 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div className="flex-1 leading-relaxed">{currentError}</div>
          <button
            type="button"
            onClick={clearCurrentError}
            className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-200 cursor-pointer"
          >
            <X className="size-3.5" />
            <span className="sr-only">Tutup peringatan</span>
          </button>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <Mail className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span>Alamat Email</span>
          </label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              disabled={isLoading}
              placeholder="nama@smkn6malang.sch.id"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (currentError) clearCurrentError();
              }}
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-blue-400"
            />
            {isEmailValid && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <CheckCircle2 className="size-4 text-emerald-500 dark:text-emerald-400" />
              </div>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <Lock className="size-3.5 text-blue-600 dark:text-blue-400" />
              <span>Kata Sandi</span>
            </label>
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
            >
              Lupa sandi?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={isLoading}
              placeholder="Masukkan kata sandi akun"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (currentError) clearCurrentError();
              }}
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-blue-400"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
              </span>
            </button>
          </div>
          {password.length > 0 && !isPasswordValid && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-0.5">
              <AlertCircle className="size-3" />
              Kata sandi sebaiknya minimal 6 karakter.
            </p>
          )}
        </div>

        {/* Options Row: Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label
            htmlFor="remember"
            className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(Boolean(checked))}
            />
            <span>Ingat saya di perangkat ini</span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Memproses Masuk...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      {/* Social Divider */}
      <div className="relative my-6 text-center text-xs">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-white/10" />
        </div>
        <span className="relative bg-white px-3 text-slate-400 dark:bg-[#16212D] dark:text-slate-500">
          atau lanjutkan dengan
        </span>
      </div>

      {/* Google Sign-in Button */}
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={handleGoogleClick}
          className="w-full h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all cursor-pointer flex items-center justify-center gap-3 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          {/* Google Official G Logo */}
          <svg className="size-4.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span className="text-xs sm:text-sm">Masuk dengan Akun Google</span>
        </Button>

        <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
          Khusus akun yang sudah ditautkan di profil pengguna
        </p>
      </div>

      {/* Footer Support Info */}
      <div className="mt-6 border-t border-slate-200/60 pt-4 text-center dark:border-white/10">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Belum memiliki akun PKL atau kendala akses?{" "}
          <Link
            href="/contact"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
          >
            <span>Hubungi Tim Hubin</span>
          </Link>
        </p>
      </div>

      {/* Modal / Dialog Bantuan Lupa Sandi */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#16212D] text-slate-900 dark:text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base">
                <HelpCircle className="size-5 text-blue-600 dark:text-blue-400" />
                <span>Bantuan Reset Kata Sandi</span>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Untuk menjaga integritas dan keamanan data PKL SMKN 6 Malang, permohonan reset sandi akun siswa maupun pembimbing dilakukan secara terverifikasi melalui Tim Hubungan Industri (Hubin).
            </p>
            <div className="rounded-2xl bg-slate-50 dark:bg-white/5 p-3.5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <p className="font-semibold text-slate-800 dark:text-white">Langkah yang dapat dilakukan:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Hubungi guru pembimbing PKL jurusan Anda.</li>
                <li>Atau kirim pesan ke Tim Hubin melalui halaman Kontak.</li>
                <li>Admin akan memverifikasi identitas Anda sebelum mengatur ulang sandi.</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelpModal(false)}
                className="rounded-xl border-slate-200 dark:border-white/10"
              >
                Mengerti
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white"
              >
                <Link href="/contact">Halaman Kontak</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
