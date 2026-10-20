import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Building2, Users } from "lucide-react";
import type { Company } from "@/types/company";

interface FeaturedCompaniesProps {
  companies?: Company[];
}

export default function FeaturedCompanies({ companies }: FeaturedCompaniesProps) {
  const displayList = companies && companies.length > 0 ? companies.slice(0, 4) : [];

  if (displayList.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <Badge variant="outline" className="border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10 mb-2">
            Mitra Rekomendasi
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Perusahaan Tempat PKL Favorit
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
            Pilihan industri teknologi, multimedia, dan manufaktur unggulan dengan mentor berpengalaman.
          </p>
        </div>

        <Button asChild variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-white/5 w-fit">
          <Link href="/companies" className="flex items-center gap-1.5 font-semibold">
            Lihat Semua Perusahaan ({companies?.length || displayList.length})
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayList.map((company) => (
          <Link
            key={company.id || company.slug}
            href={`/companies/${company.slug}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] transition-[transform,border-color,box-shadow] duration-200 ease-out will-change-transform hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl shadow-sm dark:shadow-none"
          >
            <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              {company.image_url ? (
                <Image
                  src={company.image_url}
                  alt={company.name}
                  fill
                  className="object-cover transition-transform duration-300 ease-out will-change-transform group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-1">
                  <Building2 className="size-8 text-slate-300 dark:text-slate-600" />
                  <span className="text-[11px]">Mitra Industri</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  DU/DI Mitra
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-1">
                  {company.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                  {company.description || "Perusahaan mitra industri resmi program Praktik Kerja Lapangan."}
                </p>

                {company.departments && company.departments.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {company.departments.map((dept) => (
                      <span
                        key={dept.id || dept.code}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md border bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                        style={{ borderColor: dept.color ? `${dept.color}60` : undefined, color: dept.color || undefined }}
                      >
                        {dept.code}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 truncate max-w-[60%]">
                  <MapPin className="size-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{company.address || "Malang, Jawa Timur"}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Users className="size-3.5" />
                  <span>{company.member_count ?? 0} Akun</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
