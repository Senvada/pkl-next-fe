"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import type { Company, Department } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MapsSidebar, { type CompanyWithDistance } from "./maps-sidebar";

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

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
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

export default function MapsClient({ companies, departments }: MapsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filteredCompanies = useMemo((): CompanyWithDistance[] => {
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
        distanceKm: calculateDistance(SCHOOL_POS.lat, SCHOOL_POS.lng, c.lat, c.lng),
      }));
  }, [companies, search, selectedDept]);

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[750px]">
        <div className="lg:col-span-8 h-[450px] lg:h-full rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-md dark:shadow-2xl relative">
          <DynamicLeafletMap
            companies={filteredCompanies}
            selectedCompany={selectedCompany}
            onSelectCompany={(c) => setSelectedCompany(c)}
          />

          <div className="absolute top-4 right-4 z-1000 hidden sm:flex flex-col gap-1.5 rounded-2xl border border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-[#16212D]/95 p-3 backdrop-blur-md text-[11px] shadow-lg">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
              <span className="size-3 rounded-full bg-[#FF3D00] ring-2 ring-white" />
              <span>Titik Kampus SMKN 6 Malang</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="size-3 rounded-full bg-[#008CFF] ring-2 ring-white" />
              <span>Mitra Industri Aktif</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 pt-0.5 border-t border-slate-100 dark:border-white/5">
              <span className="w-4 h-0.5 border-b-2 border-dashed border-blue-500" />
              <span>Garis Jarak ke Sekolah</span>
            </div>
          </div>
        </div>

        <MapsSidebar
          companies={filteredCompanies}
          selectedCompany={selectedCompany}
          onSelectCompany={(c) => setSelectedCompany(c)}
        />
      </div>
    </div>
  );
}
