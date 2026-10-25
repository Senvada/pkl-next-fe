export const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  draft: { label: "Draf", className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  review: { label: "Review", className: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300" },
  reject: { label: "Ditolak", className: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300" },
  published: { label: "Terbit", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" },
  archived: { label: "Arsip", className: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" },
};

export const STYLE_LABELS: Record<number, string> = {
  1: "Klasik",
  2: "Overlay",
  3: "Frosted",
  4: "Editorial",
};
