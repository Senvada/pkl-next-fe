import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Background from "@/assets/img/Background.webp";

export default function HeroBanner() {
  return (
    <section className="relative isolate min-h-[88vh] sm:min-h-[640px] max-h-[820px] flex items-center justify-center overflow-hidden pt-24 pb-20 bg-[#0B111A]">
      {/* Background Image with Ambient Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={Background}
          alt="PKL SMKN 6 Malang"
          fill
          priority
          className="object-cover object-center opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B111A]/90 via-[#0B111A]/60 to-[#0B111A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-300 backdrop-blur-md">
            <Sparkles className="size-4 text-blue-400 animate-pulse" />
            <span>Pusat Keunggulan Vokasi — SMKN 6 Malang</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl sm:leading-tight">
            Temukan Tempat PKL Terbaik,{" "}
            <span className="bg-linear-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Raih Pengalaman Industri Nyata
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base leading-relaxed text-slate-300 sm:text-lg lg:text-xl max-w-2xl mx-auto">
            Akses ratusan mitra industri terverifikasi, pantau kuota lowongan secara
            realtime, dan persiapkan portofolio magang terbaikmu dalam satu portal digital.
          </p>

          {/* Quick CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Link href="/companies" className="flex items-center gap-2">
                <Building2 className="size-5" />
                Cari Tempat PKL
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium backdrop-blur-sm cursor-pointer"
            >
              <Link href="/about">Pelajari Alur PKL</Link>
            </Button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>120+ Mitra Industri Resmi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Transparansi Sisa Kuota</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Sertifikasi Standar Industri</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
