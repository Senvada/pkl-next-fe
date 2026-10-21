"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CompanySelect } from "@/components/shared/company-select";
import type { Company } from "@/types/company";

interface ArticleFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  companyId: string;
  onCompanyChange: (companyId: string) => void;
  companies: Company[];
}

const STATUS_TABS = [
  { value: "ALL", label: "Semua Status" },
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draf" },
  { value: "archived", label: "Arsip" },
];

export default function ArticleFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  companyId,
  onCompanyChange,
}: ArticleFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari judul artikel..."
          className="pl-9 rounded-xl border-slate-200 dark:border-slate-800 text-xs focus-visible:ring-sky-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Company Combobox with Infinite Scroll */}
        <div className="w-[210px]">
          <CompanySelect
            value={companyId || null}
            onChange={(val) => onCompanyChange(val || "")}
            placeholder="Semua Perusahaan"
            className="h-8 text-xs rounded-xl"
            allowClear
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
          {STATUS_TABS.map((tab) => {
            const isActive = status === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onStatusChange(tab.value)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
