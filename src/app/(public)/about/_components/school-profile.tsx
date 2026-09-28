import { DEPARTMENTS } from "@/lib/mock-data";
import { Check, MapPin, School } from "lucide-react";

export default function SchoolProfile() {
  return (
    <section className="py-16 sm:py-24 bg-slate-100/70 dark:bg-[#121A24] border-y border-slate-200/80 dark:border-white/5 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: School Overview */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <School className="size-3.5" />
              SMK Pusat Keunggulan (Center of Excellence)
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              SMK Negeri 6 Kota Malang
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              SMKN 6 Malang merupakan salah satu institusi pendidikan kejuruan
              rujukan nasional di Jawa Timur yang berkomitmen mencetak lulusan
              yang berdaya saing global, berkarakter mulia, dan siap memimpin
              perubahan di era industri 4.0.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <div className="flex size-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Check className="size-3.5" />
                </div>
                <span>Akreditasi A Unggul dari BAN-SM</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Check className="size-3.5" />
                </div>
                <span>Fasilitas Teaching Factory & Lab Komputer Spesifikasi Tinggi</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Check className="size-3.5" />
                </div>
                <span>Kerjasama Industri Skala Nasional & Multinasional</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <MapPin className="size-4 text-rose-500 shrink-0" />
              <span>Jl. Ki Ageng Gribig No. 28, Madyopuro, Kota Malang, Jawa Timur</span>
            </div>
          </div>

          {/* Right Column: Departments Grid */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-6 sm:p-8 shadow-sm dark:shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Program Keahlian Peserta PKL
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
                Kompetensi yang siap berkontribusi langsung pada proyek nyata di perusahaan mitra:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {DEPARTMENTS.map((dept) => (
                  <div
                    key={dept.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 dark:border-white/5 dark:bg-white/5 p-4 transition hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {dept.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${dept.badgeBg}`}>
                          {dept.code}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                        {dept.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
