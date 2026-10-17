import { STATS } from "@/lib/mock-data";
import { Building2, Users, GraduationCap, Award } from "lucide-react";

const statIcons = [Building2, Users, GraduationCap, Award];

export default function StatsOverview() {
  return (
    <section className="relative z-20 -mt-10 mb-16 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-4">
        {STATS.map((stat, i) => {
          const Icon = statIcons[i % statIcons.length];
          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-[#16212D]/90 p-5 sm:p-6 transition-[border-color,box-shadow] duration-200 ease-out hover:border-blue-500/40 hover:shadow-xl shadow-md shadow-slate-200/50 dark:shadow-none"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200 ease-out will-change-transform">
                  <Icon className="size-5 sm:size-6" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {stat.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
