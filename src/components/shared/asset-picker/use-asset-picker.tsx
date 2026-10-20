"use client";

import * as React from "react";
import { AssetPickerModal } from "./asset-picker-modal";
import type {
  AssetPickerOptions,
  AssetPickerResolver,
  AssetPickerContextValue,
} from "./types";
import type { Asset } from "@/types/asset";

const AssetPickerContext = React.createContext<AssetPickerContextValue | null>(null);

export function useAssetPicker() {
  const ctx = React.useContext(AssetPickerContext);
  if (!ctx) {
    throw new Error("useAssetPicker must be used within <AssetPickerProvider>");
  }
  return ctx;
}

export function AssetPickerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState<AssetPickerOptions | undefined>();
  const resolverRef = React.useRef<AssetPickerResolver | null>(null);

  const pick = React.useCallback(
    (opts?: AssetPickerOptions): Promise<Asset | null> => {
      return new Promise((resolve) => {
        resolverRef.current = resolve;
        setOptions(opts);
        setIsOpen(true);
      });
    },
    []
  );

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(null);
      resolverRef.current = null;
    }
  }, []);

  const handleConfirm = React.useCallback((asset: Asset) => {
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(asset);
      resolverRef.current = null;
    }
  }, []);

  return (
    <AssetPickerContext.Provider value={{ pick }}>
      {children}
      <AssetPickerModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        options={options}
      />
    </AssetPickerContext.Provider>
  );
}
