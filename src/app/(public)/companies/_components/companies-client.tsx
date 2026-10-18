"use client";

import { useState, useMemo } from "react";
import { Company, Department } from "@/lib/mock-data";
import CompanyCard from "./company-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Building2 } from "lucide-react";

interface CompaniesClientProps {
  companies: Company[];
  departments: Department[];
}

export default function CompaniesClient({
  companies,
  departments,
}: CompaniesClientProps) {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"name" | "quota">("name");

  const filteredCompanies = useMemo(() => {
    return companies
      .filter((company) => {
        const matchesSearch =
          company.name.toLowerCase().includes(search.toLowerCase()) ||
          company.description.toLowerCase().includes(search.toLowerCase()) ||
          company.city.toLowerCase().includes(search.toLowerCase()) ||
          company.category.toLowerCase().includes(search.toLowerCase());

        const matchesDept =
          selectedDept === "ALL" || company.departments.includes(selectedDept);

        return matchesSearch && matchesDept;
      })
      .sort((a, b) => {
        if (sortBy === "quota") return b.openQuota - a.openQuota;
        return a.name.localeCompare(b.name);
      });
  }, [companies, search, selectedDept, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setSelectedDept("ALL");
    setSortBy("name");
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-4 sm:p-6 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari nama perusahaan, keahlian, atau kota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-blue-500 rounded-xl"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:inline">
              Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "name" | "quota")
              }
              className="h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="name" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                🔤 Nama (A - Z)
              </option>
              <option value="quota" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                👥 Kuota Terbanyak
              </option>
            </select>
          </div>
        </div>

        {/* Department Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mr-1">
            Jurusan:
          </span>
          <button
            onClick={() => setSelectedDept("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 ease-out cursor-pointer ${
              selectedDept === "ALL"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:border-white/10"
            }`}
          >
            Semua ({companies.length})
          </button>

          {departments.map((dept) => {
            const count = companies.filter((c) =>
              c.departments.includes(dept.code)
            ).length;
            const isSelected = selectedDept === dept.code;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 ease-out cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:border-white/10"
                }`}
              >
                <span>{dept.code}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}

          {(search || selectedDept !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 h-8 ml-auto"
            >
              Reset Filter
            </Button>
          )}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Menampilkan <strong className="text-slate-900 dark:text-white font-bold">{filteredCompanies.length}</strong> dari {companies.length} perusahaan
        </span>
        {selectedDept !== "ALL" && (
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            Jurusan: {departments.find((d) => d.code === selectedDept)?.name}
          </span>
        )}
      </div>

      {/* Grid of Companies */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.slug} company={company} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-white/60 dark:bg-[#16212D]/50 shadow-xs">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 mb-4">
            <Building2 className="size-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Tidak ada perusahaan yang cocok
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Coba gunakan kata kunci lain atau ubah filter jurusan yang kamu pilih.
          </p>
          <Button
            onClick={resetFilters}
            variant="outline"
            size="sm"
            className="mt-5 border-slate-200 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
          >
            Hapus Semua Filter
          </Button>
        </div>
      )}
    </div>
  );
}
