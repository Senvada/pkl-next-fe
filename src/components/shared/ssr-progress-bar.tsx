"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface SSRProgressBarProps {
  delayMs?: number;
  height?: number;
}

let onPageReady: (() => void) | null = null;

export function finishSSRProgress() {
  onPageReady?.();
}

function ProgressBarInner({ delayMs = 250, height = 3 }: SSRProgressBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const delayTimer = React.useRef<NodeJS.Timeout | null>(null);
  const trickleTimer = React.useRef<NodeJS.Timeout | null>(null);
  const currentUrl = React.useRef("");
  const progressVal = React.useRef(0);

  const clearTimers = React.useCallback(() => {
    if (delayTimer.current) clearTimeout(delayTimer.current);
    if (trickleTimer.current) clearInterval(trickleTimer.current);
    delayTimer.current = null;
    trickleTimer.current = null;
  }, []);

  const finish = React.useCallback(() => {
    clearTimers();
    currentUrl.current = window.location.pathname + window.location.search;

    if (progressVal.current > 0 && barRef.current && containerRef.current) {
      barRef.current.style.width = "100%";
      setTimeout(() => {
        if (containerRef.current) containerRef.current.style.opacity = "0";
        setTimeout(() => {
          if (barRef.current) barRef.current.style.width = "0%";
          progressVal.current = 0;
        }, 200);
      }, 150);
    }
  }, [clearTimers]);

  React.useEffect(() => {
    onPageReady = finish;
    return () => { onPageReady = null; };
  }, [finish]);

  React.useEffect(() => {
    finish();
  }, [pathname, searchParams, finish]);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element)?.closest("a");
      if (!a?.href || a.hasAttribute("download") || a.target === "_blank") return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const targetPath = url.pathname + url.search;
      if (targetPath === currentUrl.current || (url.hash && url.pathname === window.location.pathname)) return;

      clearTimers();
      delayTimer.current = setTimeout(() => {
        if (!containerRef.current || !barRef.current) return;
        progressVal.current = 15;
        containerRef.current.style.opacity = "1";
        barRef.current.style.width = "15%";

        trickleTimer.current = setInterval(() => {
          if (!barRef.current || progressVal.current >= 90) return;
          progressVal.current += (90 - progressVal.current) * 0.15;
          barRef.current.style.width = `${progressVal.current}%`;
        }, 200);
      }, delayMs);
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      clearTimers();
    };
  }, [delayMs, clearTimers]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 inset-x-0 z-[99999] pointer-events-none opacity-0 transition-opacity duration-200"
      style={{ height: `${height}px` }}
    >
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500 shadow-[0_0_10px_#2563eb,0_0_5px_#38bdf8] transition-[width] duration-200 ease-out"
        style={{ width: "0%" }}
      />
    </div>
  );
}

export function SSRProgressBar(props: SSRProgressBarProps) {
  return (
    <React.Suspense fallback={null}>
      <ProgressBarInner {...props} />
    </React.Suspense>
  );
}
