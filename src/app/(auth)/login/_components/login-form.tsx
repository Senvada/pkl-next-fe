"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useLogin } from "@/hooks/modules/auth/useLogin";
import type { LoginFormData } from "@/types/auth";
import { LoginHeader } from "./login-header";
import { LoginOAuthButton } from "./login-oauth-button";
import { LoginHelpModal } from "./login-help-modal";

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
  const loginMutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const isLoading = externalLoading || loginMutation.isPending;
  const currentError =
    externalError ||
    internalError ||
    (loginMutation.error ? loginMutation.error.message : null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalError(null);
    loginMutation.reset();
    if (onClearError) onClearError();

    if (!email) return setInternalError("Silakan masukkan alamat email Anda.");
    if (!isEmailValid) return setInternalError("Format alamat email tidak valid.");
    if (!password) return setInternalError("Silakan masukkan kata sandi akun Anda.");

    if (onSubmit) {
      await onSubmit({ email, password, remember });
    } else {
      loginMutation.mutate({ email, password, remember });
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
    loginMutation.reset();
    if (onClearError) onClearError();
  };

  return (
    <div className="relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/95 p-6 sm:p-9 xl:p-10 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#16212D]/95 dark:shadow-2xl">
      <LoginHeader />

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
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
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {password.length > 0 && !isPasswordValid && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-0.5">
              <AlertCircle className="size-3" />
              Kata sandi sebaiknya minimal 6 karakter.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-600 dark:text-slate-300">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(Boolean(checked))}
            />
            <span>Ingat saya di perangkat ini</span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-[background-color,transform,box-shadow] duration-150 ease-out cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
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

      <div className="relative my-6 text-center text-xs">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-white/10" />
        </div>
        <span className="relative bg-white px-3 text-slate-400 dark:bg-[#16212D] dark:text-slate-500">
          atau lanjutkan dengan
        </span>
      </div>

      <LoginOAuthButton isLoading={isLoading} onClick={handleGoogleClick} />

      <div className="mt-6 border-t border-slate-200/60 pt-4 text-center dark:border-white/10">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Belum memiliki akun PKL atau kendala akses?{" "}
          <Link href="/contact" className="font-semibold text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1">
            <span>Hubungi Tim Hubin</span>
          </Link>
        </p>
      </div>

      <LoginHelpModal open={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
}
