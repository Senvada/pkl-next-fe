"use client";

import StyleClassic from "./styles/style-classic";
import StyleOverlay from "./styles/style-overlay";
import StyleFrosted from "./styles/style-frosted";
import StyleEditorial from "./styles/style-editorial";
import type { ArticleCardPreviewProps } from "./styles/types";

export default function ArticleCardPreview(props: ArticleCardPreviewProps) {
  const { styleConfig } = props;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Live Card Preview
        </span>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
          {styleConfig.height}px
        </span>
      </div>

      <div className="transition-all duration-300">
        {styleConfig.type === 1 && <StyleClassic {...props} />}
        {styleConfig.type === 2 && <StyleOverlay {...props} />}
        {styleConfig.type === 3 && <StyleFrosted {...props} />}
        {styleConfig.type === 4 && <StyleEditorial {...props} />}
      </div>
    </div>
  );
}
