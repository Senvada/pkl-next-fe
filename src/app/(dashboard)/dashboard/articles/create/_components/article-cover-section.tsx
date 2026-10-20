"use client";

import * as React from "react";
import { Loader2, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCropperModal } from "@/components/shared/image-cropper-modal";
import { usePresignArticleCoverMutation } from "@/hooks/modules/article";

interface ArticleCoverSectionProps {
  coverUrl?: string;
  onCoverChange: (url: string) => void;
  articleId?: string;
}

export default function ArticleCoverSection({
  coverUrl,
  onCoverChange,
  articleId,
}: ArticleCoverSectionProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = React.useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = React.useState(false);
  const [rawSelectedFileSrc, setRawSelectedFileSrc] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const presignMutation = usePresignArticleCoverMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Hanya format JPG, PNG, WebP, dan GIF yang didukung.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Ukuran gambar maksimal 10 MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setRawSelectedFileSrc(objectUrl);
    setCropImageSrc(objectUrl);
    setIsCropperOpen(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropComplete = async ({ file, url }: { file: File; url: string }) => {
    setUploadError(null);
    setIsUploading(true);
    onCoverChange(url);

    try {
      const presign = await presignMutation.mutateAsync({
        id: articleId,
        payload: {
          content_type: file.type || "image/webp",
          file_size: file.size,
        },
      });

      const uploadRes = await fetch(presign.upload_url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "image/webp" },
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload storage gagal (${uploadRes.status})`);
      }

      onCoverChange(presign.public_url);
      setIsCropperOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah foto cover.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
        Cover Gambar Artikel (16:9)
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="rounded-xl border-slate-300 dark:border-slate-700 text-xs gap-2"
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin text-sky-500" />
          ) : (
            <Upload className="size-4 text-slate-500" />
          )}
          {coverUrl ? "Ganti Foto Cover" : "Unggah & Potong Foto (16:9)"}
        </Button>

        {coverUrl && rawSelectedFileSrc && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setCropImageSrc(rawSelectedFileSrc);
              setIsCropperOpen(true);
            }}
            className="text-xs text-sky-600 dark:text-sky-400 gap-1.5"
          >
            <Camera className="size-3.5" />
            Sesuaikan Crop
          </Button>
        )}
      </div>

      {uploadError && <p className="text-xs text-rose-500 mt-1">{uploadError}</p>}

      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={cropImageSrc}
        aspectRatio={16 / 9}
        cropShape="rect"
        title="Sesuaikan Cover Artikel (16:9)"
        description="Pilih dan sesuaikan proporsi rasio 16:9 gambar cover artikel Anda."
        outputFileName="article_cover.webp"
        onCropComplete={handleCropComplete}
        isSubmitting={isUploading}
      />
    </div>
  );
}
