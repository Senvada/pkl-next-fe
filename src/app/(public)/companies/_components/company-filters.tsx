"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { DepartmentDropdown } from "@/components/shared/department-dropdown";

interface CompanyFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedDept: string;
  onDeptChange: (code: string) => void;
  sortBy: "name" | "quota";
  onSortChange: (sort: "name" | "quota") => void;
  departments: { code: string; count: number; name?: string; color?: string }[];
  totalCount: number;
  onReset: () => void;
}

export function CompanyFilters({
  search,
  onSearchChange,
  selectedDept,
  onDeptChange,
  sortBy,
  onSortChange,
  departments,
  totalCount,
  onReset,
}: CompanyFiltersProps) {
  const isFiltered = Boolean(search || selectedDept !== "ALL");
  const activeDept = departments.find((d) => d.code === selectedDept);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-3.5 sm:p-5 shadow-sm dark:shadow-xl space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari nama perusahaan, keahlian, atau kota..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-blue-500 rounded-xl text-sm"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DepartmentDropdown
            departments={departments}
            selectedDept={selectedDept}
            onDeptChange={onDeptChange}
            totalCount={totalCount}
          />

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as "name" | "quota")}
            className="h-11 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shrink-0"
          >
            <option value="name">🔤 Nama (A - Z)</option>
            <option value="quota">👥 Akun Terbanyak</option>
          </select>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-11 px-2.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl shrink-0"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {selectedDept !== "ALL" && activeDept && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400">
          <span>Filter aktif:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
            {activeDept.color && (
              <span
                className="size-2 rounded-full inline-block shrink-0 ring-1 ring-black/10 dark:ring-white/20"
                style={{ backgroundColor: activeDept.color }}
              />
            )}
            <span>{activeDept.code} - {activeDept.name}</span>
            <button
              onClick={() => onDeptChange("ALL")}
              className="hover:text-blue-800 dark:hover:text-white ml-0.5 cursor-pointer"
              title="Hapus filter jurusan"
            >
              <X className="size-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
