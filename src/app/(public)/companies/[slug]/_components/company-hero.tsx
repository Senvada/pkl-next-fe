import Link from "next/link";
import Image from "next/image";
import { Company, DEPARTMENTS } from "@/lib/mock-data";
import { ArrowLeft, MapPin, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CompanyHero({ company }: { company: Company }) {
  return (
    <div className="relative pt-24 sm:pt-28 pb-8 overflow-hidden">
      {/* Back button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 dark:border-white/10 dark:bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition backdrop-blur-md shadow-xs"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Direktori Perusahaan
        </Link>
      </div>

      {/* Banner Card */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl">
          <Image
            src={company.bannerImage}
            alt={company.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />

          {/* Bottom Title Bar inside Hero */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className="bg-blue-600 text-white font-semibold">
                    {company.category}
                  </Badge>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 backdrop-blur-md font-semibold">
                    <span className="size-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse" />
                    Mitra Industri Terdaftar
                  </Badge>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  {company.name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-rose-400" />
                    <span>{company.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="size-4 text-sky-400" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {company.website.replace("https://", "")}
                    </a>
                  </div>
                </div>
              </div>

              {/* Department Badges */}
              <div className="flex flex-wrap gap-1.5">
                {company.departments.map((deptCode) => {
                  const dept = DEPARTMENTS.find((d) => d.code === deptCode);
                  return (
                    <span
                      key={deptCode}
                      className={`text-xs font-bold px-3 py-1 rounded-lg border backdrop-blur-md ${
                        dept?.badgeBg ?? "bg-slate-800 text-slate-300 border-slate-700"
                      }`}
                    >
                      {deptCode}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
