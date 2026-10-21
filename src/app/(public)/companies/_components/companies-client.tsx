"use client";

import { useState, useMemo } from "react";
import CompanyCard from "./company-card";
import { CompanyFilters } from "./company-filters";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import type { Company } from "@/types/company";
import type { Department } from "@/types/department";

interface CompaniesClientProps {
  companies: Company[];
  initialDepartments?: Department[];
}

export default function CompaniesClient({ companies, initialDepartments = [] }: CompaniesClientProps) {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"name" | "quota">("name");

  const departments = useMemo(() => {
    const deptMap = new Map<string, number>();
    companies.forEach((comp) => {
      comp.departments?.forEach((d) => {
        deptMap.set(d.code, (deptMap.get(d.code) || 0) + 1);
      });
    });

    if (initialDepartments.length > 0) {
      return initialDepartments.map((d) => ({
        code: d.code,
        name: d.name,
        color: d.color,
        count: deptMap.get(d.code) || 0,
      }));
    }

    return Array.from(deptMap.entries()).map(([code, count]) => ({ code, count }));
  }, [companies, initialDepartments]);

  const filteredCompanies = useMemo(() => {
    return companies
      .filter((company) => {
        const query = search.toLowerCase();
        const matchesSearch =
          company.name.toLowerCase().includes(query) ||
          (company.description && company.description.toLowerCase().includes(query)) ||
          (company.address && company.address.toLowerCase().includes(query));

        const matchesDept =
          selectedDept === "ALL" ||
          company.departments?.some((d) => d.code === selectedDept);

        return matchesSearch && matchesDept;
      })
      .sort((a, b) => {
        if (sortBy === "quota") return (b.member_count ?? 0) - (a.member_count ?? 0);
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
      <CompanyFilters
        search={search}
        onSearchChange={setSearch}
        selectedDept={selectedDept}
        onDeptChange={setSelectedDept}
        sortBy={sortBy}
        onSortChange={setSortBy}
        departments={departments}
        totalCount={companies.length}
        onReset={resetFilters}
      />

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Menampilkan <strong className="text-slate-900 dark:text-white font-bold">{filteredCompanies.length}</strong> dari {companies.length} mitra industri
        </span>
      </div>

      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id || company.slug} company={company} />
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
