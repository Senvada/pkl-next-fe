"use client";

import * as React from "react";
import type { ArticleBlock, AutoSaveStatus } from "../types";

interface UseAutoSaveProps {
  blocks: ArticleBlock[];
  onSave: (blocks: ArticleBlock[]) => Promise<void>;
  debounceMs?: number;
}

export function useAutoSave({
  blocks,
  onSave,
  debounceMs = 800,
}: UseAutoSaveProps) {
  const [status, setStatus] = React.useState<AutoSaveStatus>("idle");
  const lastSavedJsonRef = React.useRef<string>("");
  const isInitialMount = React.useRef(true);
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const executeSave = React.useCallback(
    async (blocksToSave: ArticleBlock[]) => {
      const currentJson = JSON.stringify(blocksToSave);
      if (currentJson === lastSavedJsonRef.current) {
        return;
      }

      setStatus("saving");
      try {
        await onSave(blocksToSave);
        lastSavedJsonRef.current = currentJson;
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    },
    [onSave]
  );

  React.useEffect(() => {
    // Skip saving on initial mount before hydration
    if (isInitialMount.current) {
      if (blocks && blocks.length > 0) {
        lastSavedJsonRef.current = JSON.stringify(blocks);
        isInitialMount.current = false;
      }
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      executeSave(blocks);
    }, debounceMs);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [blocks, debounceMs, executeSave]);

  const forceSave = React.useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    return executeSave(blocks);
  }, [blocks, executeSave]);

  return {
    status,
    forceSave,
  };
}
