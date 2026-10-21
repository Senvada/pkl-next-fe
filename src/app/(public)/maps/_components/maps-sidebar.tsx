"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Building2, Navigation, ExternalLink } from "lucide-react";
import type { Company } from "@/lib/mock-data";

export interface CompanyWithDistance extends Company {
  distanceKm: string;
}

interface MapsSidebarProps {
  companies: CompanyWithDistance[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company) => void;
}

export default function MapsSidebar({
  companies,
  selectedCompany,
  onSelectCompany,
}: MapsSidebarProps) {
  const selectedCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCompany && selectedCardRef.current) {
      selectedCardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedCompany]);

  return (
    <div className="lg:col-span-4 h-[420px] lg:h-full min-h-0 flex flex-col rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-4 sm:p-5 shadow-sm dark:shadow-2xl">
      <div className="pb-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="size-4 text-blue-600 dark:text-blue-400" />
          Daftar Mitra ({companies.length})
        </h3>
        <span className="text-[11px] text-slate-400">Klik untuk fokus</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pt-3 pr-1">
        {companies.map((comp) => {
          const isSelected = selectedCompany?.id === comp.id;
          return (
            <div
              key={comp.id}
              ref={isSelected ? selectedCardRef : null}
              onClick={() => onSelectCompany(comp)}
              className={`p-3.5 rounded-2xl border transition-colors duration-150 ease-out cursor-pointer ${
                isSelected
                  ? "border-blue-500 bg-blue-50/80 dark:bg-blue-500/10 shadow-xs ring-1 ring-blue-500/20"
                  : "border-slate-100 bg-slate-50/80 hover:bg-slate-100 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {comp.name}
                  </h4>
                  <p className="text-[10px] text-blue-600 dark:text-sky-400 font-semibold uppercase mt-0.5">
                    {comp.category || "Mitra Industri"}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 shrink-0">
                  Aktif
                </span>
              </div>

              <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {comp.address}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-300">
                  <Navigation className="size-3 text-rose-500" />
                  <span>~{comp.distanceKm} km dari sekolah</span>
                </div>

                <Link
                  href={`/companies/${comp.slug}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  Detail <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
