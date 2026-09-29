import { Company, DEPARTMENTS } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Clock,
  Calendar,
  Briefcase,
  Gift,
  GraduationCap,
} from "lucide-react";

export default function CompanyInfoTabs({ company }: { company: Company }) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-6 sm:p-8 shadow-sm dark:shadow-xl">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
          <TabsTrigger
            value="overview"
            className="rounded-lg text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
          >
            Tentang Perusahaan
          </TabsTrigger>
          <TabsTrigger
            value="requirements"
            className="rounded-lg text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
          >
            Kualifikasi
          </TabsTrigger>
          <TabsTrigger
            value="facilities"
            className="rounded-lg text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
          >
            Fasilitas & Jam Kerja
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Profil Perusahaan
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {company.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <GraduationCap className="size-4 text-blue-600 dark:text-blue-400" />
              Jurusan yang Diterima di Perusahaan Ini:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {company.departments.map((deptCode) => {
                const dept = DEPARTMENTS.find((d) => d.code === deptCode);
                return (
                  <div
                    key={deptCode}
                    className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50 dark:border-white/5 dark:bg-white/5 p-3.5"
                  >
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded border shrink-0 ${
                        dept?.badgeBg ?? "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {deptCode}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {dept?.name ?? deptCode}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {dept?.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Requirements */}
        <TabsContent value="requirements" className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Briefcase className="size-5 text-blue-600 dark:text-blue-400" />
              Kriteria & Persyaratan Kompetensi
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
              Calon peserta PKL diharapkan memenuhi kualifikasi dasar berikut sebelum mendaftar:
            </p>
            <div className="space-y-3">
              {company.requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50 dark:border-white/5 dark:bg-white/5 p-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                >
                  <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Facilities */}
        <TabsContent value="facilities" className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Gift className="size-5 text-emerald-600 dark:text-emerald-400" />
              Benefit & Fasilitas Selama PKL
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {company.facilities.map((fac, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 dark:border-white/5 dark:bg-white/5 p-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                >
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50 dark:border-white/5 dark:bg-white/5 p-4 flex items-center gap-3">
                <Calendar className="size-5 text-sky-500" />
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-medium">Hari Kerja</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{company.workDays}</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200/80 bg-slate-50 dark:border-white/5 dark:bg-white/5 p-4 flex items-center gap-3">
                <Clock className="size-5 text-amber-500" />
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-medium">Jam Kerja</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{company.workHours}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
