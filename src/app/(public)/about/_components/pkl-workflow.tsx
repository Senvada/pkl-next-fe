import { PKL_WORKFLOW } from "@/lib/mock-data";
import {
  Compass,
  Search,
  Briefcase,
  CheckCircle2,
  Award,
  ChevronRight,
} from "lucide-react";

const stepIcons = [Compass, Search, Briefcase, CheckCircle2, Award];

export default function PklWorkflow() {
  return (
    <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Standar Operasional Prosedur
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Tahapan Alur Pelaksanaan PKL
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Lima langkah terencana mulai dari persiapan mental dan keterampilan di sekolah hingga presentasi laporan sertifikasi industri.
        </p>
      </div>

      <div className="relative">
        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PKL_WORKFLOW.map((workflow, index) => {
            const Icon = stepIcons[index % stepIcons.length];
            return (
              <div
                key={workflow.step}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-6 transition-all duration-300 hover:border-blue-500/40 shadow-xs dark:shadow-lg group"
              >
                {/* Step Badge and Icon */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      0{workflow.step}
                    </span>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                    {workflow.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {workflow.description}
                  </p>
                </div>

                {/* Sub details bullet points */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
                  {workflow.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <ChevronRight className="size-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
