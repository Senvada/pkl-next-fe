"use client";

import { LayoutTemplate, Sparkles, BookOpen, Layers } from "lucide-react";
import type { ArticleCardStyle } from "@/types/article";

interface ArticleStyleSelectorProps {
  selectedType: ArticleCardStyle;
  onSelectType: (type: ArticleCardStyle) => void;
  height: number;
  onChangeHeight: (height: number) => void;
}

const STYLES: { type: ArticleCardStyle; label: string; desc: string; icon: typeof LayoutTemplate }[] = [
  { type: 1, label: "Klasik", desc: "Foto atas & info terpisah", icon: LayoutTemplate },
  { type: 2, label: "Overlay", desc: "Full bleed gradien gelap", icon: Layers },
  { type: 3, label: "Frosted", desc: "Panel kaca blur melayang", icon: Sparkles },
  { type: 4, label: "Editorial", desc: "Tipografi ala majalah", icon: BookOpen },
];

export default function ArticleStyleSelector({
  selectedType,
  onSelectType,
  height,
  onChangeHeight,
}: ArticleStyleSelectorProps) {
  return (
    <div className="space-y-4">
      {/* 4 Styles Grid */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Gaya Tampilan Kartu
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {STYLES.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedType === s.type;
            return (
              <button
                key={s.type}
                type="button"
                onClick={() => onSelectType(s.type)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-sky-500 bg-sky-50/70 dark:bg-sky-950/30 text-sky-950 dark:text-sky-100 ring-2 ring-sky-500/20 shadow-sm"
                    : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20"
                }`}
              >
                <div
                  className={`size-8 rounded-lg flex items-center justify-center mb-2 ${
                    isSelected
                      ? "bg-sky-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <Icon className="size-4" />
                </div>
                <span className="text-xs font-bold leading-tight">{s.label}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {s.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Height Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-slate-700 dark:text-slate-200">Tinggi Kartu</label>
          <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{height}px</span>
        </div>
        <input
          type="range"
          min={320}
          max={600}
          step={10}
          value={height}
          onChange={(e) => onChangeHeight(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Ringkas (320px)</span>
          <span>Standar (420px)</span>
          <span>Tinggi (600px)</span>
        </div>
      </div>
    </div>
  );
}
