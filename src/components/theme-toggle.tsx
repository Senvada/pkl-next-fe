"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function ThemeToggle({
  className,
  isTransparent = false,
}: {
  className?: string;
  isTransparent?: boolean;
}) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "size-9 rounded-full text-slate-400 hover:text-white hover:bg-white/10",
          className
        )}
        aria-label="Ganti Tema"
      >
        <Sun className="size-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "size-9 rounded-full transition-all cursor-pointer",
        isDark
          ? "text-amber-400 hover:text-amber-300 hover:bg-white/10"
          : isTransparent
          ? "text-white hover:text-white hover:bg-white/10"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70",
        className
      )}
      title={isDark ? "Beralih ke Tema Terang" : "Beralih ke Tema Gelap"}
      aria-label="Ganti Tema"
    >
      {isDark ? (
        <Sun className="size-4.5 rotate-0 transition-transform duration-300" />
      ) : (
        <Moon className="size-4.5 rotate-0 transition-transform duration-300" />
      )}
    </Button>
  );
}
