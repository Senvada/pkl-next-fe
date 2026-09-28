import Link from "next/link";
import Image from "next/image";
import { COMPANIES, DEPARTMENTS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Star, Users } from "lucide-react";

export default function FeaturedCompanies() {
  const featured = COMPANIES.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
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
            Lihat Semua Perusahaan ({COMPANIES.length})
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((company) => (
          <Link
            key={company.slug}
            href={`/companies/${company.slug}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl shadow-sm dark:shadow-none"
          >
            {/* Banner with Logo Overlay */}
            <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={company.bannerImage}
                alt={company.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

              {/* Rating Pill */}
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-amber-400 backdrop-blur-md">
                <Star className="size-3.5 fill-amber-400" />
                <span>{company.rating}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {company.category}
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-1">
                  {company.name}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                  {company.shortDescription}
                </p>

                {/* Departments Tag */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {company.departments.map((deptCode) => {
                    const dept = DEPARTMENTS.find((d) => d.code === deptCode);
                    return (
                      <span
                        key={deptCode}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                          dept?.badgeBg ?? "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {deptCode}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Meta: Quota & Location */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-slate-400" />
                  <span>{company.city}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  <Users className="size-3.5" />
                  <span>Sisa: {company.openQuota}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
