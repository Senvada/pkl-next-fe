"use client";

import * as React from "react";
import { UploadCloud, Loader2, AlertCircle } from "lucide-react";
import { useUploadAsset } from "@/hooks/modules/asset";
import type { Asset } from "@/types/asset";

interface AssetPickerDropzoneProps {
  folder?: string;
  onAssetUploaded: (asset: Asset) => void;
  accept?: string[];
}

export function AssetPickerDropzone({
  folder = "articles",
  onAssetUploaded,
  accept = ["image/jpeg", "image/png", "image/webp", "image/gif"],
}: AssetPickerDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const uploadMutation = useUploadAsset();

  const handleProcessFile = async (file: File) => {
    setErrorMsg(null);
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Ukuran file maksimal 10 MB.");
      return;
    }

    try {
      const asset = await uploadMutation.mutateAsync({ file, folder });
      onAssetUploaded(asset);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah file.";
      setErrorMsg(msg);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  return (
    <div className="space-y-3">
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900/40">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? "border-sky-500 bg-sky-50/60 dark:bg-sky-950/20"
            : "border-slate-200 dark:border-white/10 hover:border-sky-400 bg-slate-50/50 dark:bg-slate-900/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(",")}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleProcessFile(file);
          }}
        />

        {uploadMutation.isPending ? (
          <div className="flex flex-col items-center gap-2 text-sky-600 dark:text-sky-400">
            <Loader2 className="size-8 animate-spin" />
            <span className="text-xs font-semibold">Mengunggah ke Galeri Aset...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400 text-center">
            <div className="size-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <UploadCloud className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Seret foto ke sini atau klik untuk memilih
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Otomatis tersimpan di Galeri Aset & terpilih ke artikel
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
