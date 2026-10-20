"use client";

import * as React from "react";
import { Info, Lightbulb, AlertTriangle, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalloutBlockData } from "../../types";

interface BlockCalloutProps {
  data: CalloutBlockData;
  onChange: (patch: Partial<CalloutBlockData>) => void;
  previewMode?: boolean;
}

const INTENT_CONFIG = {
  info: {
    label: "Info",
    icon: Info,
    container: "bg-sky-50/70 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/60 text-sky-950 dark:text-sky-200",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  tip: {
    label: "Tips",
    icon: Lightbulb,
    container: "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    label: "Peringatan",
    icon: AlertTriangle,
    container: "bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  quote: {
    label: "Kutipan",
    icon: Quote,
    container: "bg-slate-50/80 dark:bg-slate-900/40 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200",
    iconColor: "text-slate-500 dark:text-slate-400",
  },
};

export function BlockCallout({ data, onChange, previewMode = false }: BlockCalloutProps) {
  const cfg = INTENT_CONFIG[data.intent || "info"];
  const Icon = cfg.icon;

  if (previewMode) {
    return (
      <div className={cn("my-3 flex gap-3.5 rounded-2xl border p-4 shadow-2xs", cfg.container)}>
        <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", cfg.iconColor)} />
        <div className="space-y-1 text-sm leading-relaxed flex-1">
          {data.title && <div className="font-semibold">{data.title}</div>}
          <div className="whitespace-pre-wrap">{data.content || "Konten catatan kosong"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2.5 rounded-2xl border p-3.5 transition-colors", cfg.container)}>
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <div className="flex items-center gap-1.5">
          <Icon className={cn("h-4 w-4", cfg.iconColor)} />
          <span className="text-xs font-semibold">{cfg.label}</span>
        </div>
        <div className="flex items-center gap-1 bg-background/80 p-0.5 rounded-lg border border-border/40">
          {(["info", "tip", "warning", "quote"] as const).map((intentKey) => {
            const ItemIcon = INTENT_CONFIG[intentKey].icon;
            return (
              <button
                key={intentKey}
                type="button"
                onClick={() => onChange({ intent: intentKey })}
                className={cn(
                  "p-1 rounded text-xs transition-colors",
                  data.intent === intentKey ? "bg-muted font-bold text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                title={INTENT_CONFIG[intentKey].label}
              >
                <ItemIcon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      </div>

      <input
        type="text"
        value={data.title || ""}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Judul catatan (opsional)..."
        className="w-full bg-transparent font-medium text-sm placeholder:text-muted-foreground/50 border-none p-0 focus:outline-none"
      />

      <textarea
        value={data.content || ""}
        onChange={(e) => onChange({ content: e.target.value })}
        rows={2}
        placeholder="Tulis pesan atau kutipan di sini..."
        className="w-full bg-transparent text-xs sm:text-sm placeholder:text-muted-foreground/50 border-none p-0 focus:outline-none resize-none leading-relaxed"
      />
    </div>
  );
}
