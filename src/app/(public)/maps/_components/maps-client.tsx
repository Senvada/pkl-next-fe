"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { Company, Department } from "@/lib/mock-data";
import {
  Search,
  Building2,
  ExternalLink,
  Navigation,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// Dynamic import with SSR false so Leaflet doesn't hit 'window is not defined'
const DynamicLeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-xs font-semibold">Memuat Peta Interaktif...</span>
      </div>
    </div>
  ),
});

// Haversine distance calculator in KM
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

const SCHOOL_POS = { lat: -7.9750644, lng: 112.6717543 };

interface MapsClientProps {
  companies: Company[];
  departments: Department[];
}

export default function MapsClient({
  companies,
  departments,
}: MapsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filteredCompanies = useMemo(() => {
    return companies
      .filter((company) => {
        const matchesSearch =
          company.name.toLowerCase().includes(search.toLowerCase()) ||
          company.city.toLowerCase().includes(search.toLowerCase()) ||
          company.address.toLowerCase().includes(search.toLowerCase());

        const matchesDept =
          selectedDept === "ALL" || company.departments.includes(selectedDept);

        return matchesSearch && matchesDept;
      })
      .map((c) => ({
        ...c,
        distanceKm: calculateDistance(
          SCHOOL_POS.lat,
          SCHOOL_POS.lng,
          c.lat,
          c.lng
        ),
      }));
  }, [companies, search, selectedDept]);

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] shadow-xs dark:shadow-md">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari lokasi atau nama perusahaan mitra..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedDept("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors duration-150 ease-out cursor-pointer ${
              selectedDept === "ALL"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:border-white/10"
            }`}
          >
            Semua Jurusan
          </button>
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors duration-150 ease-out cursor-pointer ${
                selectedDept === dept.code
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:border-white/10"
              }`}
            >
              {dept.code}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[750px]">
        {/* Left Interactive Map Container */}
        <div className="lg:col-span-8 h-[450px] lg:h-full rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-md dark:shadow-2xl relative">
          <DynamicLeafletMap
            companies={companies}
            selectedCompany={selectedCompany}
            onSelectCompany={(c) => setSelectedCompany(c)}
          />

          {/* Map Legend Overlay */}
          <div className="absolute top-4 right-4 z-1000 hidden sm:flex flex-col gap-1.5 rounded-2xl border border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-[#16212D]/95 p-3 backdrop-blur-md text-[11px] shadow-lg">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
              <span className="size-3 rounded-full bg-blue-600 ring-2 ring-white" />
              <span>Titik Kampus SMKN 6 Malang</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="size-3 rounded-full bg-sky-500 ring-2 ring-white" />
              <span>Mitra Industri Aktif</span>
            </div>
          </div>
        </div>

        {/* Right Company List Sidebar */}
        <div className="lg:col-span-4 h-[350px] lg:h-full flex flex-col rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-4 sm:p-5 shadow-sm dark:shadow-2xl">
          <div className="pb-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="size-4 text-blue-600 dark:text-blue-400" />
              Daftar Mitra ({filteredCompanies.length})
            </h3>
            <span className="text-[11px] text-slate-400">Klik untuk fokus</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1">
            {filteredCompanies.map((comp) => {
              const isSelected = selectedCompany?.id === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompany(comp)}
                  className={`p-3.5 rounded-2xl border transition-colors duration-150 ease-out cursor-pointer ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-xs"
                      : "border-slate-100 bg-slate-50/80 hover:bg-slate-100 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {comp.name}
                      </h4>
                      <p className="text-[10px] text-blue-600 dark:text-sky-400 font-semibold uppercase mt-0.5">
                        {comp.category}
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
      </div>
    </div>
  );
}
