import * as React from "react";
import { BlockViewer } from "@/components/shared/block-builder/block-viewer";
import { Info } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CompanyContentBody({ company }: { company: any }) {
  const rawContent = company.content;
  const hasBlocks = Array.isArray(rawContent) && rawContent.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {hasBlocks ? (
        <div className="bg-white dark:bg-[#16212D] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <BlockViewer blocks={rawContent} />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#16212D] rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          {company.description ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="size-5 text-blue-600 dark:text-blue-400" />
                Tentang Perusahaan
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {company.description}
              </p>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              <p className="text-sm font-medium">
                Belum ada konten profil terperinci yang dibuat untuk mitra ini.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
