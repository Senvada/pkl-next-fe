import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, Building } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20 bg-linear-to-b from-blue-50/70 via-slate-50 to-slate-100 dark:from-[#1E2A38] dark:via-[#141C26] dark:to-slate-950 transition-colors">
      {/* Decorative Blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge
          variant="outline"
          className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 px-3.5 py-1 text-xs font-semibold"
        >
          Profil & Program Unggulan
        </Badge>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
          Menjembatani Pendidikan Vokasi dengan{" "}
          <span className="bg-linear-to-r from-blue-600 via-sky-500 to-indigo-600 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent">
            Dunia Industri Nyata
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          Program Praktik Kerja Lapangan (PKL) di SMK Negeri 6 Malang dirancang
          secara terstruktur untuk membentuk profesional muda yang adaptif,
          kompeten, dan berkarakter kuat sesuai kebutuhan industri global.
        </p>

        {/* Feature Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 dark:border-white/10 dark:bg-white/5 px-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 backdrop-blur-md shadow-xs">
            <GraduationCap className="size-4 text-blue-600 dark:text-blue-400" />
            <span>Kurikulum Berbasis Industri</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 dark:border-white/10 dark:bg-white/5 px-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 backdrop-blur-md shadow-xs">
            <Building className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>120+ Jejaring Mitra Korporat</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 dark:border-white/10 dark:bg-white/5 px-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 backdrop-blur-md shadow-xs">
            <Award className="size-4 text-amber-600 dark:text-amber-400" />
            <span>Sertifikasi Kompetensi Resmi</span>
          </div>
        </div>
      </div>
    </section>
  );
}
