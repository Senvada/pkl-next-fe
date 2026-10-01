import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Logo from "@/assets/icon/Logo(150x150).svg";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 dark:bg-[#0B111A] dark:text-slate-100 transition-colors duration-200">
      {/* Ambient background decoration */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 size-96 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/15" />
        <div className="absolute top-1/2 -right-40 size-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/15" />
      </div>

      {/* Auth Top Header */}
      <header className="relative z-10 w-full border-b border-slate-200/70 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-[#0E1724]/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <Image
              src={Logo}
              alt="Logo PKL SMKN 6 Malang"
              width={38}
              height={38}
              className="h-9 w-auto"
              priority
            />
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white">
                PKL SMKN 6 MALANG
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                Portal Vokasi Digital
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              <Link href="/" className="flex items-center gap-1.5">
                <ArrowLeft className="size-3.5" />
                <span className="hidden sm:inline">Kembali ke</span> Beranda
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-slate-200/60 bg-white/50 py-4 text-center text-xs text-slate-500 backdrop-blur-xs dark:border-white/10 dark:bg-[#0E1724]/50 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4">
          <p>
            &copy; {new Date().getFullYear()+" "} PKL SMKN 6 Malang &amp; Senvada. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
