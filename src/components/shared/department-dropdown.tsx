"use client";

import * as React from "react";
import { ChevronDown, Check, GraduationCap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface DepartmentDropdownItem {
  id?: string;
  code: string;
  name?: string;
  color?: string;
  count?: number;
}

interface DepartmentDropdownProps {
  departments: DepartmentDropdownItem[];
  selectedDept: string;
  onDeptChange: (code: string) => void;
  totalCount?: number;
  className?: string;
}

export function DepartmentDropdown({
  departments,
  selectedDept,
  onDeptChange,
  totalCount,
  className,
}: DepartmentDropdownProps) {
  const activeDept = React.useMemo(
    () => departments.find((d) => d.code === selectedDept),
    [departments, selectedDept]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between gap-2 min-w-[150px] sm:min-w-[180px] max-w-[240px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            selectedDept !== "ALL" && "border-blue-500/40 bg-blue-50/50 dark:bg-blue-500/10",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedDept === "ALL" ? (
              <>
                <GraduationCap className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate font-medium">Semua Jurusan</span>
                {totalCount !== undefined && <span className="text-xs text-slate-400">({totalCount})</span>}
              </>
            ) : (
              <>
                {activeDept?.color && (
                  <span
                    className="size-2.5 rounded-full inline-block shrink-0 ring-1 ring-black/10 dark:ring-white/20"
                    style={{ backgroundColor: activeDept.color }}
                  />
                )}
                <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">
                  {activeDept?.code || selectedDept}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:inline">
                  {activeDept?.name}
                </span>
              </>
            )}
          </div>
          <ChevronDown className="size-4 text-slate-400 shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[280px] max-h-[360px] overflow-y-auto p-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#16212D] shadow-xl z-50"
      >
        <DropdownMenuLabel className="text-[11px] font-semibold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
          Filter Jurusan
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => onDeptChange("ALL")}
          className={cn(
            "flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-xs font-medium",
            selectedDept === "ALL" && "bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 font-semibold"
          )}
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span>Semua Jurusan</span>
          </div>
          <div className="flex items-center gap-1.5">
            {totalCount !== undefined && <span className="text-[11px] text-slate-400">({totalCount})</span>}
            {selectedDept === "ALL" && <Check className="size-3.5 text-blue-600 dark:text-blue-400" />}
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-white/5" />

        {departments.map((dept) => {
          const isSelected = selectedDept === dept.code;
          return (
            <DropdownMenuItem
              key={dept.code}
              onClick={() => onDeptChange(dept.code)}
              className={cn(
                "flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-xs",
                isSelected
                  ? "bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-700 dark:text-slate-200"
              )}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                {dept.color && (
                  <span
                    className="size-2.5 rounded-full inline-block shrink-0 ring-1 ring-black/10 dark:ring-white/20"
                    style={{ backgroundColor: dept.color }}
                  />
                )}
                <span className="font-bold shrink-0">{dept.code}</span>
                <span className="text-slate-500 dark:text-slate-400 truncate text-[11px]">{dept.name}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {dept.count !== undefined && <span className="text-[10px] text-slate-400">({dept.count})</span>}
                {isSelected && <Check className="size-3.5 text-blue-600 dark:text-blue-400" />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
