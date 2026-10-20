import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, ArrowUpRight, Building2 } from "lucide-react";
import type { Company } from "@/types/company";

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] transition-[transform,border-color,box-shadow] duration-200 ease-out will-change-transform hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl shadow-sm dark:shadow-none">
      {/* Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
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

        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Mitra Aktif</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-1">
            {company.name}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
            {company.description || "Perusahaan mitra industri resmi program Praktik Kerja Lapangan."}
          </p>

          {/* Department Badges */}
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

        {/* Bottom Meta & Link */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="size-3.5 text-rose-500 shrink-0" />
              <span className="truncate max-w-[140px]">{company.address || "Malang, Jawa Timur"}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Users className="size-3.5" />
              <span>{company.member_count ?? 0} akun terdaftar</span>
            </div>
          </div>

          <Link
            href={`/companies/${company.slug}`}
            className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-150 ease-out shadow-xs"
            aria-label={`Detail ${company.name}`}
          >
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
