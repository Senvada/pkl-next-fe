import Link from "next/link";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CtaBanner() {
  return (
    <section className="py-16 sm:py-20 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-linear-to-r from-blue-900/60 via-[#1B2735] to-[#121922] p-8 sm:p-12 lg:p-16 shadow-2xl">
        {/* Glow circle background */}
        <div className="absolute -right-20 -bottom-20 size-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 size-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-block rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md mb-4">
            Mulai Langkah Nyata Karirmu
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Siap Menemukan Tempat Magang Impianmu Hari Ini?
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
            Jelajahi profil mitra, periksa ketersediaan kuota, atau buka peta interaktif untuk melihat perusahaan terdekat dari lokasi tempat tinggalmu.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <Link href="/companies" className="flex items-center gap-2">
                <Building2 className="size-4" />
                Daftar Perusahaan
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium cursor-pointer"
            >
              <Link href="/maps" className="flex items-center gap-2">
                <MapPin className="size-4 text-blue-400" />
                Buka Peta Interaktif
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
