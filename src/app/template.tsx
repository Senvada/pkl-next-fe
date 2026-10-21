"use client";

import * as React from "react";
import { finishSSRProgress } from "@/components/shared/ssr-progress-bar";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // requestAnimationFrame ensures the browser has physically painted the new page
    const raf = requestAnimationFrame(() => {
      finishSSRProgress();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return <>{children}</>;
}
