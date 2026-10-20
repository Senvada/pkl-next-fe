"use client";

import * as React from "react";
import type { ArticleBlock } from "../types";

const MAX_HISTORY = 20;

export function useBlockHistory(initialBlocks: ArticleBlock[] = []) {
  const [blocks, setBlocks] = React.useState<ArticleBlock[]>(initialBlocks);
  const [history, setHistory] = React.useState<ArticleBlock[][]>([]);
  const [future, setFuture] = React.useState<ArticleBlock[][]>([]);

  // Hydrate when initialBlocks arrive
  const isHydratedRef = React.useRef(false);
  React.useEffect(() => {
    if (!isHydratedRef.current && initialBlocks && initialBlocks.length > 0) {
      setBlocks(initialBlocks);
      isHydratedRef.current = true;
    }
  }, [initialBlocks]);

  const updateBlocks = React.useCallback(
    (action: ArticleBlock[] | ((prev: ArticleBlock[]) => ArticleBlock[]), record = true) => {
      setBlocks((current) => {
        const next = typeof action === "function" ? action(current) : action;
        if (record) {
          setHistory((prev) => [...prev.slice(-(MAX_HISTORY - 1)), current]);
          setFuture([]);
        }
        return next;
      });
    },
    []
  );

  const undo = React.useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;

      const previous = prevHistory[prevHistory.length - 1];
      const newHistory = prevHistory.slice(0, -1);

      setBlocks((current) => {
        setFuture((prevFuture) => [current, ...prevFuture]);
        return previous;
      });

      return newHistory;
    });
  }, []);

  const redo = React.useCallback(() => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;

      const next = prevFuture[0];
      const newFuture = prevFuture.slice(1);

      setBlocks((current) => {
        setHistory((prevHistory) => [...prevHistory, current]);
        return next;
      });

      return newFuture;
    });
  }, []);

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return {
    blocks,
    setBlocks: updateBlocks,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
  };
}
