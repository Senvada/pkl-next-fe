"use client";

import * as React from "react";
import { FolderKanban, UploadCloud, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AssetPickerGrid } from "./asset-picker-grid";
import { AssetPickerDropzone } from "./asset-picker-dropzone";
import type { Asset } from "@/types/asset";
import type { AssetPickerOptions } from "./types";

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (asset: Asset) => void;
  options?: AssetPickerOptions;
}

export function AssetPickerModal({
  isOpen,
  onClose,
  onConfirm,
  options,
}: AssetPickerModalProps) {
  const [tab, setTab] = React.useState<"gallery" | "upload">("gallery");
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);

  const handleClose = () => {
    setSelectedAsset(null);
    setTab("gallery");
    onClose();
  };

  const handleAssetUploaded = (newAsset: Asset) => {
    onConfirm(newAsset);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl rounded-2xl p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
            {options?.title || "Pilih Media dari Galeri Aset"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Pilih foto dari Galeri Aset atau unggah foto baru langsung dari perangkat Anda.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setTab("gallery")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === "gallery"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            <FolderKanban className="size-3.5" />
            Jelajahi Galeri Aset
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === "upload"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            <UploadCloud className="size-3.5" />
            Upload Foto Baru
          </button>
        </div>

        {/* Tab Body */}
        <div className="pt-1">
          {tab === "gallery" ? (
            <AssetPickerGrid
              selectedAsset={selectedAsset}
              onSelect={setSelectedAsset}
              onConfirm={(asset) => {
                onConfirm(asset);
                onClose();
              }}
            />
          ) : (
            <AssetPickerDropzone
              folder={options?.folder || "articles"}
              onAssetUploaded={handleAssetUploaded}
              accept={options?.accept}
            />
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex items-center justify-between sm:justify-between pt-2 border-t border-slate-100 dark:border-white/5">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            className="rounded-xl text-xs"
          >
            Batal
          </Button>

          {tab === "gallery" && (
            <Button
              type="button"
              disabled={!selectedAsset}
              onClick={() => {
                if (selectedAsset) {
                  onConfirm(selectedAsset);
                  handleClose();
                }
              }}
              className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs gap-1.5 shadow-sm"
            >
              <Check className="size-3.5" />
              Pilih Aset Ini
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
